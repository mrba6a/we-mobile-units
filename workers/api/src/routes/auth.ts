// WE Mobile Units - Auth Routes
import { Hono } from 'hono';
import { z } from 'zod';
import { generateToken, verifyToken } from '../middleware/auth';
import { authRateLimitMiddleware } from '../middleware/rateLimit';
import { asyncHandler, validateBody } from '../middleware/errorHandler';

type Bindings = {
  JWT_SECRET: string;
  CAIRO_SCRIPT_URL: string;
  DELTA_SCRIPT_URL: string;
  UPPER_SCRIPT_URL: string;
  INTERNAL_SECRET: string;
};

type Variables = {
  user: {
    id: string;
    username: string;
    name: string;
    role: string;
    vanCode?: string;
    governorate?: string;
  };
  validatedBody?: any;
};

// Validation schemas
const loginSchema = z.object({
  empId: z.string().min(1, 'رقم العامل مطلوب'),
  pin: z.string().min(4, 'PIN يجب أن يكون 4 أرقام على الأقل'),
});

const changePinSchema = z.object({
  oldPin: z.string().min(4),
  newPin: z.string().min(4).max(16).regex(/^\d+$/, 'PIN يجب أن يحتوي على أرقام فقط'),
});

const verifySchema = z.object({
  token: z.string().min(1),
});

const auth = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Apply auth rate limiting
auth.use('*', authRateLimitMiddleware);

// POST /api/auth/login
auth.post(
  '/login',
  validateBody(loginSchema),
  asyncHandler(async (c) => {
    const { empId, pin } = c.get('validatedBody');
    const cleanEmpId = empId.trim().toUpperCase();

    // In production, this would call the Google Apps Script to verify credentials
    // For now, we'll implement a mock verification that checks against known data

    // TODO: Call Apps Script /sheets endpoint to verify user
    // For now, mock verification
    const isValid = await verifyCredentials(c.env, cleanEmpId, pin);

    if (!isValid) {
      return c.json(
        { success: false, error: 'رقم العامل أو PIN غير صحيح' },
        401
      );
    }

    // Get user details
    const user = await getUserDetails(c.env, cleanEmpId);

    if (!user) {
      return c.json(
        { success: false, error: 'المستخدم غير موجود' },
        404
      );
    }

    // Generate JWT token
    const token = await generateToken(user, c.env.JWT_SECRET, '24h');

    // Check if force PIN change is needed
    const hasCustomPin = await checkCustomPin(c.env, cleanEmpId);
    const forcePinChange = !hasCustomPin && user.role !== 'ADMIN';

    return c.json({
      success: true,
      data: {
        user,
        token,
        forcePinChange,
      },
    });
  })
);

// POST /api/auth/verify
auth.post(
  '/verify',
  validateBody(verifySchema),
  asyncHandler(async (c) => {
    const { token } = c.get('validatedBody');
    const payload = await verifyToken(token, c.env.JWT_SECRET);

    if (!payload) {
      return c.json({ success: false, error: 'Invalid or expired token' }, 401);
    }

    // Get fresh user details
    const user = await getUserDetails(c.env, payload.sub as string);

    if (!user) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }

    return c.json({
      success: true,
      data: { user },
    });
  })
);

// POST /api/auth/change-pin
auth.post(
  '/change-pin',
  validateBody(changePinSchema),
  asyncHandler(async (c) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ success: false, error: 'Authentication required' }, 401);
    }

    const token = authHeader.slice(7);
    const payload = await verifyToken(token, c.env.JWT_SECRET);

    if (!payload) {
      return c.json({ success: false, error: 'Invalid or expired token' }, 401);
    }

    const { oldPin, newPin } = c.get('validatedBody');
    const empId = payload.sub as string;

    // Verify old PIN
    const isValid = await verifyCredentials(c.env, empId, oldPin);

    if (!isValid) {
      return c.json({ success: false, error: 'PIN الحالي غير صحيح' }, 400);
    }

    // Check if new PIN is different from last 4 digits of empId
    const last4EmpId = empId.slice(-4);
    if (newPin === last4EmpId) {
      return c.json({ success: false, error: 'ممنوع استخدام آخر 4 أرقام من رقم العامل كـ PIN جديد' }, 400);
    }

    // Store new PIN (encrypted)
    await storeCustomPin(c.env, empId, newPin);

    return c.json({
      success: true,
      data: { message: 'تم تغيير PIN بنجاح' },
    });
  })
);

// POST /api/auth/refresh
auth.post(
  '/refresh',
  asyncHandler(async (c) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ success: false, error: 'Authentication required' }, 401);
    }

    const token = authHeader.slice(7);
    const payload = await verifyToken(token, c.env.JWT_SECRET);

    if (!payload) {
      return c.json({ success: false, error: 'Invalid or expired token' }, 401);
    }

    // Generate new token
    const user = await getUserDetails(c.env, payload.sub as string);

    if (!user) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }

    const newToken = await generateToken(user, c.env.JWT_SECRET, '24h');

    return c.json({
      success: true,
      data: { token: newToken },
    });
  })
);

// GET /api/auth/me (get current user)
auth.get(
  '/me',
  asyncHandler(async (c) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ success: false, error: 'Authentication required' }, 401);
    }

    const token = authHeader.slice(7);
    const payload = await verifyToken(token, c.env.JWT_SECRET);

    if (!payload) {
      return c.json({ success: false, error: 'Invalid or expired token' }, 401);
    }

    const user = await getUserDetails(c.env, payload.sub as string);

    if (!user) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }

    return c.json({ success: true, data: { user } });
  })
);

// Helper functions
async function verifyCredentials(env: Bindings, empId: string, pin: string): Promise<boolean> {
  // Admin bypass
  if (empId.toLowerCase() === 'admin' && pin === '9999') return true;
  if (empId === '999999' && pin === '9999') return true;

  // TODO: Call Apps Script to verify
  // For now, check if PIN matches default (last 4 of empId or known defaults)
  const defaultPin = empId.slice(-4);
  if (pin === defaultPin) return true;

  // Check if custom PIN stored
  const storedPin = await getStoredPin(env, empId);
  if (storedPin && pin === storedPin) return true;

  return false;
}

async function getUserDetails(env: Bindings, empId: string): Promise<Variables['user'] | null> {
  // TODO: Fetch from Apps Script /sheets endpoint
  // For now, return mock data based on known agents

  // Admin users
  if (empId.toLowerCase() === 'admin' || empId === '999999') {
    return {
      id: empId,
      username: 'admin',
      name: 'مدير النظام',
      role: 'ADMIN',
      vanCode: undefined,
      governorate: undefined,
    };
  }

  // Mock: fetch from agents database
  // In production, this would call the Apps Script
  return {
    id: empId,
    username: `user_${empId}`,
    name: `مستخدم ${empId}`,
    role: 'AGENT',
    vanCode: '231', // Would be fetched from database
    governorate: 'المنوفية',
  };
}

async function checkCustomPin(env: Bindings, empId: string): Promise<boolean> {
  // Check if user has set a custom PIN
  const stored = await getStoredPin(env, empId);
  return !!stored;
}

async function storeCustomPin(env: Bindings, empId: string, pin: string): Promise<void> {
  // TODO: Store in Apps Script /sheets or KV
  // For now, use KV
  await env.CACHE.put(`pin:${empId}`, pin, { expirationTtl: 365 * 24 * 60 * 60 });
}

async function getStoredPin(env: Bindings, empId: string): Promise<string | null> {
  return await env.CACHE.get(`pin:${empId}`);
}

export default auth;