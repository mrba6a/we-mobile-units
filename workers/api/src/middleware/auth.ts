// WE Mobile Units - Auth Middleware
import { Context, Next } from 'hono';
import { jwtVerify, JWTPayload } from 'jose';

type Bindings = {
  JWT_SECRET: string;
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
};

export async function authMiddleware(c: Context<{ Bindings: Bindings; Variables: Variables }>, next: Next) {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'Missing or invalid authorization header' }, 401);
  }

  const token = authHeader.slice(7);

  try {
    const secret = new TextEncoder().encode(c.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
    });

    // Attach user to context
    c.set('user', {
      id: payload.sub as string,
      username: payload.username as string,
      name: payload.name as string,
      role: payload.role as string,
      vanCode: payload.vanCode as string | undefined,
      governorate: payload.governorate as string | undefined,
    });

    await next();
  } catch (error) {
    if (error instanceof Error && error.name === 'JWTExpired') {
      return c.json({ success: false, error: 'Token expired', code: 'TOKEN_EXPIRED' }, 401);
    }
    return c.json({ success: false, error: 'Invalid token' }, 401);
  }
}

export async function optionalAuthMiddleware(c: Context<{ Bindings: Bindings; Variables: Variables }>, next: Next) {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    await next();
    return;
  }

  const token = authHeader.slice(7);

  try {
    const secret = new TextEncoder().encode(c.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
    });

    c.set('user', {
      id: payload.sub as string,
      username: payload.username as string,
      name: payload.name as string,
      role: payload.role as string,
      vanCode: payload.vanCode as string | undefined,
      governorate: payload.governorate as string | undefined,
    });
  } catch {
    // Ignore invalid tokens for optional auth
  }

  await next();
}

export function requireRole(...roles: string[]) {
  return async function roleMiddleware(c: Context<{ Bindings: Bindings; Variables: Variables }>, next: Next) {
    const user = c.get('user');
    if (!user || !roles.includes(user.role)) {
      return c.json({ success: false, error: 'Insufficient permissions' }, 403);
    }
    await next();
  };
}

export function requirePermission(resource: string, action: string) {
  return async function permissionMiddleware(c: Context<{ Bindings: Bindings; Variables: Variables }>, next: Next) {
    const user = c.get('user');
    if (!user) {
      return c.json({ success: false, error: 'Authentication required' }, 401);
    }

    // In a real implementation, you'd check against user permissions
    // For now, we'll use role-based access
    const rolePermissions: Record<string, string[]> = {
      ADMIN: ['*'],
      SUPERVISOR: ['reconciliation:read', 'finance:read', 'monthly:read', 'historical:read', 'dailyEntry:write', 'stock:read', 'stock:write', 'leaves:read', 'leaves:write', 'vans:read', 'vans:write', 'categories:read'],
      FINANCE: ['reconciliation:read', 'reconciliation:write', 'finance:read', 'finance:write', 'monthly:read', 'historical:read', 'reports:read'],
      STOCK_MANAGER: ['stock:read', 'stock:write', 'stock:delete', 'vans:read', 'vans:write', 'categories:read', 'categories:write', 'monthly:read'],
      HR: ['leaves:read', 'leaves:write', 'leaves:delete', 'users:read', 'users:write', 'monthly:read'],
      AGENT: ['dailyEntry:read', 'dailyEntry:write', 'mySales:read', 'myLeaves:read', 'myLeaves:write', 'vanSchedule:read', 'reconciliation:read'],
      SELLER: ['dailyEntry:read', 'dailyEntry:write', 'mySales:read', 'myLeaves:read', 'myLeaves:write', 'vanSchedule:read'],
    };

    const userPerms = rolePermissions[user.role] || [];
    const hasPermission = userPerms.includes('*') || userPerms.includes(`${resource}:${action}`);

    if (!hasPermission) {
      return c.json({ success: false, error: 'Permission denied' }, 403);
    }

    await next();
  };
}

export async function generateToken(user: Variables['user'], secret: string, expiresIn: string = '24h'): Promise<string> {
  const { SignJWT } = await import('jose');
  const secretKey = new TextEncoder().encode(secret);

  const token = await new SignJWT({
    sub: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    vanCode: user.vanCode,
    governorate: user.governorate,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secretKey);

  return token;
}

export async function verifyToken(token: string, secret: string): Promise<JWTPayload | null> {
  try {
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey, { algorithms: ['HS256'] });
    return payload;
  } catch {
    return null;
  }
}