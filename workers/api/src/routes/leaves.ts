// WE Mobile Units - Leaves Routes
import { Hono } from 'hono';
import { z } from 'zod';
import { asyncHandler, validateQuery, validateBody } from '../middleware/errorHandler';
import { requirePermission } from '../middleware/auth';

type Bindings = {
  CACHE: KVNamespace;
  CAIRO_SCRIPT_URL: string;
  DELTA_SCRIPT_URL: string;
  UPPER_SCRIPT_URL: string;
  REPORTS_SCRIPT_URL: string;
  INTERNAL_SECRET: string;
};

const leaves = new Hono<{ Bindings: Bindings }>();

// Validation schemas
const leavesQuerySchema = z.object({
  agentId: z.string().optional(),
  vanCode: z.string().optional(),
  governorate: z.string().optional(),
  leaveType: z.enum(['annual', 'sick', 'casual', 'emergency', 'maternity', 'paternity', 'unpaid']).optional(),
  status: z.enum(['pending', 'approved', 'rejected', 'cancelled']).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(50),
});

const leaveRequestSchema = z.object({
  agentId: z.string().optional(), // Optional - defaults to current user
  leaveType: z.enum(['annual', 'sick', 'casual', 'emergency', 'maternity', 'paternity', 'unpaid']),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().min(10, 'سبب الإجازة مطلوب (10 أحرف على الأقل)'),
});

const approveLeaveSchema = z.object({
  approved: z.boolean(),
  notes: z.string().optional(),
});

const balanceQuerySchema = z.object({
  vanCode: z.string().optional(),
  governorate: z.string().optional(),
});

// GET /api/leaves - List leave requests
leaves.get(
  '/',
  validateQuery(leavesQuerySchema),
  requirePermission('leaves', 'read'),
  asyncHandler(async (c) => {
    const { agentId, vanCode, governorate, leaveType, status, dateFrom, dateTo, page, pageSize } = c.get('validatedQuery');
    const user = c.get('user');

    // Agents can only see their own leaves unless they have higher role
    let effectiveAgentId = agentId;
    if (user.role === 'AGENT' || user.role === 'SELLER') {
      effectiveAgentId = user.id;
    }

    const mockData = generateMockLeavesData();

    let filtered = mockData;
    if (effectiveAgentId) filtered = filtered.filter(d => d.agentId === effectiveAgentId);
    if (vanCode) filtered = filtered.filter(d => d.vanCode === vanCode);
    if (governorate) filtered = filtered.filter(d => d.governorate === governorate);
    if (leaveType) filtered = filtered.filter(d => d.leaveType === leaveType);
    if (status) filtered = filtered.filter(d => d.status === status);
    if (dateFrom) filtered = filtered.filter(d => d.endDate >= dateFrom);
    if (dateTo) filtered = filtered.filter(d => d.startDate <= dateTo);

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);

    return c.json({
      success: true,
      data: paginated,
      meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
    });
  })
);

// POST /api/leaves - Create leave request
leaves.post(
  '/',
  requirePermission('leaves', 'write'),
  validateBody(leaveRequestSchema),
  asyncHandler(async (c) => {
    const leave = c.get('validatedBody');
    const user = c.get('user');

    // Use current user's ID if not specified (for agents/sellers)
    const agentId = leave.agentId || user.id;

    // Validate dates
    const startDate = new Date(leave.startDate);
    const endDate = new Date(leave.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      return c.json({ success: false, error: 'لا يمكن طلب إجازة بتاريخ سابق' }, 400);
    }
    if (endDate < startDate) {
      return c.json({ success: false, error: 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية' }, 400);
    }

    // Check leave balance
    const balance = await getLeaveBalance(c.env, agentId, leave.leaveType);
    const requestedDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    if (balance.remaining < requestedDays) {
      return c.json({
        success: false,
        error: `رصيد الإجازة غير كافٍ. المتاح: ${balance.remaining} يوم، المطلوب: ${requestedDays} يوم`,
      }, 400);
    }

    // TODO: Save to Apps Script /sheets

    const newLeave = {
      id: `leave_${Date.now()}`,
      agentId,
      agentName: user.name,
      vanCode: user.vanCode,
      governorate: user.governorate,
      leaveType: leave.leaveType,
      startDate: leave.startDate,
      endDate: leave.endDate,
      daysCount: requestedDays,
      reason: leave.reason,
      status: 'pending' as const,
      requestedAt: new Date().toISOString(),
    };

    return c.json({ success: true, data: newLeave });
  })
);

// GET /api/leaves/:id - Get single leave request
leaves.get(
  '/:id',
  requirePermission('leaves', 'read'),
  asyncHandler(async (c) => {
    const id = c.req.param('id');
    const user = c.get('user');

    // TODO: Fetch from Apps Script
    const mockData = generateMockLeavesData();
    const leave = mockData.find(d => d.id === id);

    if (!leave) {
      return c.json({ success: false, error: 'Leave request not found' }, 404);
    }

    // Check access
    if ((user.role === 'AGENT' || user.role === 'SELLER') && leave.agentId !== user.id) {
      return c.json({ success: false, error: 'Unauthorized' }, 403);
    }

    return c.json({ success: true, data: leave });
  })
);

// POST /api/leaves/:id/approve - Approve/Reject leave
leaves.post(
  '/:id/approve',
  requirePermission('leaves', 'write'),
  validateBody(approveLeaveSchema),
  asyncHandler(async (c) => {
    const id = c.req.param('id');
    const { approved, notes } = c.get('validatedBody');
    const user = c.get('user');

    // TODO: Update in Apps Script
    // TODO: If approved, deduct from leave balance

    return c.json({
      success: true,
      data: {
        id,
        status: approved ? 'approved' : 'rejected',
        reviewedAt: new Date().toISOString(),
        reviewedBy: user.id,
        notes,
      },
    });
  })
);

// POST /api/leaves/:id/cancel - Cancel leave request
leaves.post(
  '/:id/cancel',
  requirePermission('leaves', 'write'),
  asyncHandler(async (c) => {
    const id = c.req.param('id');
    const user = c.get('user');

    // TODO: Update in Apps Script (only if pending)

    return c.json({
      success: true,
      data: {
        id,
        status: 'cancelled',
        cancelledAt: new Date().toISOString(),
        cancelledBy: user.id,
      },
    });
  })
);

// GET /api/leaves/balances - Get leave balances
leaves.get(
  '/balances',
  validateQuery(balanceQuerySchema),
  requirePermission('leaves', 'read'),
  asyncHandler(async (c) => {
    const { vanCode, governorate } = c.get('validatedQuery');
    const user = c.get('user');

    // Agents can only see their own balance
    let effectiveVanCode = vanCode;
    if (user.role === 'AGENT' || user.role === 'SELLER') {
      effectiveVanCode = user.vanCode;
    }

    const mockBalances = generateMockLeaveBalances();

    let filtered = mockBalances;
    if (effectiveVanCode) filtered = filtered.filter(d => d.vanCode === effectiveVanCode);
    if (governorate) filtered = filtered.filter(d => d.governorate === governorate);

    return c.json({ success: true, data: filtered });
  })
);

// GET /api/leaves/calendar - Get leave calendar for a period
leaves.get(
  '/calendar',
  validateQuery(z.object({
    vanCode: z.string().optional(),
    governorate: z.string().optional(),
    month: z.string().regex(/^\d{4}-\d{2}$/), // YYYY-MM
  })),
  requirePermission('leaves', 'read'),
  asyncHandler(async (c) => {
    const { vanCode, governorate, month } = c.get('validatedQuery');

    // TODO: Fetch from Apps Script
    // Return calendar data structure
    const daysInMonth = new Date(parseInt(month.split('-')[0]), parseInt(month.split('-')[1]), 0).getDate();

    const calendar = Array.from({ length: daysInMonth }, (_, i) => {
      const date = `${month}-${String(i + 1).padStart(2, '0')}`;
      return {
        date,
        leaves: Math.floor(Math.random() * 5), // Mock: number of people on leave
        details: [], // Would contain leave details
      };
    });

    return c.json({ success: true, data: calendar });
  })
);

// Helper functions
function generateMockLeavesData() {
  const data = [];
  const agents = [
    { id: '113985', name: 'ابانوب سليمان صافي مسعود', vanCode: '2319', governorate: 'المنوفية' },
    { id: '113978', name: 'احمد عبد المحسن عبد الحميد', vanCode: '2346', governorate: 'الدقهلية' },
    { id: '113975', name: 'اشرف محمد حمدى حبشى حسين', vanCode: '8239', governorate: 'القاهرة الكبرى' },
    { id: '113982', name: 'عبد الرحمن أسامه محمد غنيم', vanCode: '251', governorate: 'أسيوط' },
  ];
  const leaveTypes = ['annual', 'sick', 'casual', 'emergency', 'maternity', 'paternity', 'unpaid'] as const;
  const statuses = ['pending', 'approved', 'rejected', 'cancelled'] as const;

  for (let i = 0; i < 100; i++) {
    const agent = agents[Math.floor(Math.random() * agents.length)];
    const leaveType = leaveTypes[Math.floor(Math.random() * leaveTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const startDate = new Date(2026, 10, Math.floor(Math.random() * 28) + 1);
    const endDate = new Date(startDate.getTime() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000);

    data.push({
      id: `leave_${i}`,
      agentId: agent.id,
      agentName: agent.name,
      vanCode: agent.vanCode,
      governorate: agent.governorate,
      leaveType,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      daysCount: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1,
      reason: getLeaveReason(leaveType),
      status,
      requestedAt: new Date(startDate.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      reviewedAt: status !== 'pending' ? new Date(startDate.getTime() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      reviewedBy: status !== 'pending' ? `supervisor_${Math.floor(Math.random() * 10)}` : undefined,
    });
  }

  return data;
}

function generateMockLeaveBalances() {
  const data = [];
  const agents = [
    { id: '113985', name: 'ابانوب سليمان صافي مسعود', vanCode: '2319', governorate: 'المنوفية' },
    { id: '113978', name: 'احمد عبد المحسن عبد الحميد', vanCode: '2346', governorate: 'الدقهلية' },
    { id: '113975', name: 'اشرف محمد حمدى حبشى حسين', vanCode: '8239', governorate: 'القاهرة الكبرى' },
    { id: '113982', name: 'عبد الرحمن أسامه محمد غنيم', vanCode: '251', governorate: 'أسيوط' },
  ];
  const leaveTypes = ['annual', 'sick', 'casual', 'emergency', 'maternity', 'paternity', 'unpaid'] as const;

  for (const agent of agents) {
    const balances: Record<string, any> = {};
    for (const type of leaveTypes) {
      const total = type === 'annual' ? 21 : type === 'sick' ? 14 : type === 'casual' ? 6 : type === 'emergency' ? 3 : type === 'maternity' ? 90 : type === 'paternity' ? 7 : 0;
      const used = Math.floor(Math.random() * (total / 2));
      balances[type] = { total, used, remaining: total - used };
    }
    data.push({
      agentId: agent.id,
      agentName: agent.name,
      vanCode: agent.vanCode,
      governorate: agent.governorate,
      balances,
      updatedAt: new Date().toISOString(),
    });
  }

  return data;
}

function getLeaveReason(type: string): string {
  const reasons: Record<string, string[]> = {
    annual: ['إجازة سنوية', 'إجازة عائلية', 'سفر', 'راحة'],
    sick: ['مرض', 'عملية جراحية', 'علاج', 'إعياء'],
    casual: ['ظروف طارئة', 'مناسبة عائلية', 'مواعيد رسمية'],
    emergency: ['طوارئ عائلية', 'وفاة قريب', 'حادث'],
    maternity: ['ولادة', 'رعاية مولود'],
    paternity: ['ولادة زوجة', 'رعاية مولود'],
    unpaid: ['ظروف خاصة', 'دراسة', 'سفر طويل'],
  };
  const arr = reasons[type] || ['سبب آخر'];
  return arr[Math.floor(Math.random() * arr.length)];
}

async function getLeaveBalance(env: Bindings, agentId: string, leaveType: string): Promise<{ total: number; used: number; remaining: number }> {
  // TODO: Fetch from Apps Script or cache
  const totals: Record<string, number> = {
    annual: 21,
    sick: 14,
    casual: 6,
    emergency: 3,
    maternity: 90,
    paternity: 7,
    unpaid: 0,
  };
  const total = totals[leaveType] || 0;
  const used = Math.floor(Math.random() * (total / 2));
  return { total, used, remaining: total - used };
}

export default leaves;