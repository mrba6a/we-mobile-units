// WE Mobile Units - Data Routes (Agents, Vans, Movement Plans)
import { Hono } from 'hono';
import { z } from 'zod';
import { asyncHandler, validateBody, validateQuery } from '../middleware/errorHandler';
import { requirePermission } from '../middleware/auth';

type Bindings = {
  CACHE: KVNamespace;
  CAIRO_SCRIPT_URL: string;
  DELTA_SCRIPT_URL: string;
  UPPER_SCRIPT_URL: string;
  REPORTS_SCRIPT_URL: string;
  INTERNAL_SECRET: string;
};

const data = new Hono<{ Bindings: Bindings }>();

// Validation schemas
const agentQuerySchema = z.object({
  agentId: z.string().optional(),
  role: z.string().optional(),
  vanCode: z.string().optional(),
  governorate: z.string().optional(),
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(50),
});

const vanQuerySchema = z.object({
  vanCode: z.string().optional(),
  governorate: z.string().optional(),
  sector: z.enum(['cairo', 'delta', 'upper']).optional(),
});

const movementPlanSchema = z.object({
  code: z.string(),
  ouCode: z.string(),
  plate: z.string(),
  oldLoc: z.string(),
  oldGov: z.string(),
  oldEnd: z.string(),
  newLoc: z.string(),
  newGov: z.string(),
  landmark: z.string(),
  newStart: z.string(),
  status: z.enum(['ACTIVE', 'MAINTENANCE', 'INACTIVE']),
  notes: z.string().optional(),
});

const updateMovementPlanSchema = z.object({
  updates: z.array(movementPlanSchema),
});

// GET /api/data/agents - List agents with filters
data.get(
  '/agents',
  validateQuery(agentQuerySchema),
  requirePermission('users', 'read'),
  asyncHandler(async (c) => {
    const { agentId, role, vanCode, governorate, page, pageSize } = c.get('validatedQuery');

    // TODO: Fetch from Apps Script or cache
    // For now, return mock data structure
    const mockAgents = generateMockAgents();

    let filtered = mockAgents;
    if (agentId) filtered = filtered.filter(a => a.id.includes(agentId) || a.username.includes(agentId));
    if (role) filtered = filtered.filter(a => a.role === role);
    if (vanCode) filtered = filtered.filter(a => a.vanCode === vanCode);
    if (governorate) filtered = filtered.filter(a => a.governorate === governorate);

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

// GET /api/data/agents/:id - Get single agent
data.get(
  '/agents/:id',
  requirePermission('users', 'read'),
  asyncHandler(async (c) => {
    const id = c.req.param('id');
    const mockAgents = generateMockAgents();
    const agent = mockAgents.find(a => a.id === id || a.username === id);

    if (!agent) {
      return c.json({ success: false, error: 'Agent not found' }, 404);
    }

    return c.json({ success: true, data: agent });
  })
);

// GET /api/data/vans - List vans with filters
data.get(
  '/vans',
  validateQuery(vanQuerySchema),
  requirePermission('vans', 'read'),
  asyncHandler(async (c) => {
    const { vanCode, governorate, sector } = c.get('validatedQuery');

    // TODO: Fetch from Apps Script or cache
    const mockVans = generateMockVans();

    let filtered = mockVans;
    if (vanCode) filtered = filtered.filter(v => v.code === vanCode);
    if (governorate) filtered = filtered.filter(v => v.gov === governorate);
    if (sector) {
      const sectorGovs = getSectorGovernorates(sector);
      filtered = filtered.filter(v => sectorGovs.includes(v.gov));
    }

    return c.json({ success: true, data: filtered });
  })
);

// GET /api/data/vans/:code - Get single van
data.get(
  '/vans/:code',
  requirePermission('vans', 'read'),
  asyncHandler(async (c) => {
    const code = c.req.param('code');
    const mockVans = generateMockVans();
    const van = mockVans.find(v => v.code === code);

    if (!van) {
      return c.json({ success: false, error: 'Van not found' }, 404);
    }

    return c.json({ success: true, data: van });
  })
);

// GET /api/data/movement-plan - Get daily movement plan
data.get(
  '/movement-plan',
  asyncHandler(async (c) => {
    const date = c.req.query('date') || new Date().toISOString().split('T')[0];

    // TODO: Fetch from Apps Script or KV cache
    const plan = await getMovementPlanFromCache(c.env, date);

    return c.json({ success: true, data: plan, meta: { date } });
  })
);

// POST /api/data/movement-plan - Update movement plan (admin only)
data.post(
  '/movement-plan',
  requirePermission('vans', 'write'),
  validateBody(updateMovementPlanSchema),
  asyncHandler(async (c) => {
    const { updates } = c.get('validatedBody');

    // Update in cache and sync to Apps Script
    await updateMovementPlanInCache(c.env, updates);

    // TODO: Sync to Apps Script

    return c.json({ success: true, data: { updated: updates.length } });
  })
);

// GET /api/data/sectors - Get sector configuration
data.get(
  '/sectors',
  asyncHandler(async (c) => {
    return c.json({
      success: true,
      data: {
        cairo: {
          name: 'القاهرة الكبرى',
          governorates: ['القاهرة الكبرى', 'المكتب'],
          scriptUrl: c.env.CAIRO_SCRIPT_URL,
        },
        delta: {
          name: 'الدلتا والإسكندرية',
          governorates: ['الإسكندرية', 'الشرقية', 'المنوفية', 'الغربية', 'الدقهلية', 'كفر الشيخ', 'البحيرة', 'دمياط'],
          scriptUrl: c.env.DELTA_SCRIPT_URL,
        },
        upper: {
          name: 'الصعيد (وجه قبلي)',
          governorates: ['الإسماعيلية', 'السويس', 'بورسعيد', 'الفيوم', 'بني سويف', 'المنيا', 'أسيوط', 'سوهاج', 'قنا', 'الأقصر', 'أسوان'],
          scriptUrl: c.env.UPPER_SCRIPT_URL,
        },
      },
    });
  })
);

// GET /api/data/governorates - Get all governorates
data.get(
  '/governorates',
  asyncHandler(async (c) => {
    const governorates = [
      'القاهرة الكبرى',
      'الإسكندرية',
      'الشرقية',
      'المنوفية',
      'الغربية',
      'الدقهلية',
      'كفر الشيخ',
      'البحيرة',
      'دمياط',
      'الإسماعيلية',
      'السويس',
      'بورسعيد',
      'الفيوم',
      'بني سويف',
      'المنيا',
      'أسيوط',
      'سوهاج',
      'قنا',
      'الأقصر',
      'أسوان',
      'المكتب',
    ];

    return c.json({ success: true, data: governorates });
  })
);

// GET /api/data/categories - Get product categories
data.get(
  '/categories',
  asyncHandler(async (c) => {
    const categories = [
      { id: 'we_life', name: 'WE Life', type: 'mobile' },
      { id: 'we_mix_250', name: 'WE Mix 250', type: 'mobile' },
      { id: 'we_mix_355', name: 'WE Mix 355', type: 'mobile' },
      { id: 'we_gold', name: 'WE Gold (Postpaid)', type: 'mobile' },
      { id: 'mnp', name: 'MNP (حول رقمك)', type: 'mobile' },
      { id: 'esim', name: 'E-SIM', type: 'mobile' },
      { id: 'wallet', name: 'Wallet', type: 'mobile' },
      { id: 'students', name: 'خطوط الطلبة', type: 'special' },
      { id: 'gas', name: 'خطوط الغاز الطبيعي', type: 'special' },
      { id: 'initiative', name: 'خطوط المبادرة', type: 'special' },
      { id: 'adsl', name: 'ADSL', type: 'internet' },
      { id: 'fixed_lines', name: 'Fixed Lines', type: 'internet' },
      { id: 'routers', name: 'Routers', type: 'internet' },
      { id: 'we_air', name: 'WE Air', type: 'device' },
      { id: 'ont', name: 'ONT', type: 'device' },
      { id: 'cpe', name: 'CPE', type: 'device' },
      { id: 'mifi', name: 'Mi-Fi', type: 'device' },
    ];

    return c.json({ success: true, data: categories });
  })
);

// Helper functions
function generateMockAgents() {
  // This would be replaced with actual data from Apps Script
  return [
    { id: '113985', username: 'Abanoub.masood', name: 'ابانوب سليمان صافي مسعود', role: 'AGENT', vanCode: '2319', governorate: 'المنوفية', email: 'Abanoub.masood@te.eg', phone: '01555601070' },
    { id: '113978', username: 'Ahmad.Abdelmohsen', name: 'احمد عبد المحسن عبد الحميد', role: 'AGENT', vanCode: '2346', governorate: 'الدقهلية', email: 'Ahmad.Abdelmohsen@te.eg', phone: '01555701000' },
    { id: '113975', username: 'Ashraf.habashy', name: 'اشرف محمد حمدى حبشى حسين', role: 'AGENT', vanCode: '8239', governorate: 'القاهرة الكبرى', email: 'ashraf.habashy@te.eg', phone: '01554040940' },
    { id: '999999', username: 'admin', name: 'مدير النظام', role: 'ADMIN', vanCode: undefined, governorate: undefined, email: 'admin@we.com', phone: '01000000000' },
  ];
}

function generateMockVans() {
  return [
    { code: '231', plate: 'ف ق ب 231', ouName: 'VAN(ف ق ب231)', ouCode: 'wT01Vu010921', name: 'شنشور - أشمون', gov: 'المنوفية' },
    { code: '582', plate: 'ا ل ب 582', ouName: 'VAN(ا ل ب 582)', ouCode: 'wB11Vt010921', name: 'وصال / الحصري', gov: 'القاهرة الكبرى' },
    { code: '825', plate: 'ر ل ب 825', ouName: 'VAN(ر ل ب 825)', ouCode: 'wF16Vu010921', name: 'دجلة بالمز / كفر بطا', gov: 'القاهرة الكبرى' },
    { code: '832', plate: 'ط و ب 832', ouName: 'VAN(ط و ب 832)', ouCode: 'wA04Vu010921', name: 'المكتب', gov: 'القاهرة الكبرى', isOfficeDefault: true },
    { code: '2348', plate: 'أ م ر 2348', ouName: 'Van (ا م ر2348)', ouCode: 'wK01Vw010921', name: 'الرابعة الناصرية - ثان الرمل', gov: 'الإسكندرية' },
    { code: '2349', plate: 'أ م ر 2349', ouName: 'VAN (ا م ر 2349 )', ouCode: 'wC02Vv010921', name: 'سنطيس - دمنهور', gov: 'البحيرة' },
  ];
}

function getSectorGovernorates(sector: string): string[] {
  const sectors: Record<string, string[]> = {
    cairo: ['القاهرة الكبرى', 'المكتب'],
    delta: ['الإسكندرية', 'الشرقية', 'المنوفية', 'الغربية', 'الدقهلية', 'كفر الشيخ', 'البحيرة', 'دمياط'],
    upper: ['الإسماعيلية', 'السويس', 'بورسعيد', 'الفيوم', 'بني سويف', 'المنيا', 'أسيوط', 'سوهاج', 'قنا', 'الأقصر', 'أسوان'],
  };
  return sectors[sector] || [];
}

async function getMovementPlanFromCache(env: Bindings, date: string): Promise<Record<string, any>> {
  const cached = await env.CACHE.get(`movement-plan:${date}`, 'json');
  if (cached) return cached as Record<string, any>;

  // Return default plan if not cached
  return getDefaultMovementPlan();
}

async function updateMovementPlanInCache(env: Bindings, updates: any[]): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  const existing = await getMovementPlanFromCache(env, today);
  const updated = { ...existing };

  for (const update of updates) {
    updated[update.code] = update;
  }

  await env.CACHE.put(`movement-plan:${today}`, JSON.stringify(updated));
}

function getDefaultMovementPlan(): Record<string, any> {
  return {
    "597": { code: "597", ouCode: "wA07Vu010921", plate: "ف و ب 597", oldLoc: "القرين", oldGov: "الشرقية", oldEnd: "2026-11-08", newLoc: "الأسدية - أبو حماد", newGov: "الشرقية", landmark: "طريق عمومي", newStart: "2026-11-09", status: "ACTIVE", notes: "" },
    "231": { code: "231", ouCode: "wT01Vu010921", plate: "ف ق ب 231", oldLoc: "ساقية المنقدي - أشمون", oldGov: "المنوفية", oldEnd: "2026-11-08", newLoc: "شنشور - أشمون", newGov: "المنوفية", landmark: "طريق عمومي", newStart: "2026-11-09", status: "ACTIVE", notes: "" },
    "768": { code: "768", ouCode: "wA46Vu010921", plate: "ن ف ب 768", oldLoc: "العجوزين - كفر الشيخ", oldGov: "كفر الشيخ", oldEnd: "2026-11-08", newLoc: "الروضة - مطوبس", newGov: "كفر الشيخ", landmark: "طريق عمومي", newStart: "2026-11-09", status: "ACTIVE", notes: "" },
    "2349": { code: "2349", ouCode: "wC02Vv010921", plate: "أ م ر 2349", oldLoc: "منشأة راغب - دمنهور", oldGov: "البحيرة", oldEnd: "2026-11-08", newLoc: "سنطيس - دمنهور", newGov: "البحيرة", landmark: "شارع رئيسي", newStart: "2026-11-09", status: "ACTIVE", notes: "" },
    "2348": { code: "2348", ouCode: "wK01Vw010921", plate: "أ م ر 2348", oldLoc: "أبيس الأولى - ثان الرمل", oldGov: "الإسكندرية", oldEnd: "2026-11-08", newLoc: "الرابعة الناصرية - ثان الرمل", newGov: "الإسكندرية", landmark: "شارع رئيسي", newStart: "2026-11-09", status: "ACTIVE", notes: "" },
    "251": { code: "251", ouCode: "wC02Vy010921", plate: "ف ق ب 251", oldLoc: "الشادر - أسيوط", oldGov: "أسيوط", oldEnd: "2026-11-08", newLoc: "عرب مطير - الفتح", newGov: "أسيوط", landmark: "وسط البلد", newStart: "2026-11-09", status: "ACTIVE", notes: "" },
    "469": { code: "469", ouCode: "wT01Vr010921", plate: "ن ق ب 469", oldLoc: "الصداقة - أسوان", oldGov: "أسوان", oldEnd: "2026-11-08", newLoc: "وادي خريط - نصر النوبة", newGov: "أسوان", landmark: "وسط البلد", newStart: "2026-11-09", status: "ACTIVE", notes: "" },
    "2357": { code: "2357", ouCode: "wB11Vw010921", plate: "أ م ر 2357", oldLoc: "مدرسة الأقواز الثانوية المشتركة", oldGov: "القاهرة الكبرى", oldEnd: "2026-11-08", newLoc: "الأخصاص - كوبري الأخصاص", newGov: "القاهرة الكبرى", landmark: "كوبري الأخصاص (الجيزة)", newStart: "2026-11-09", status: "ACTIVE", notes: "" },
    "627": { code: "627", ouCode: "wB11Vq010921", plate: "ج ف ب 627", oldLoc: "مدرسة الشهيد محمد عادل - طنط الجزيرة - طوخ", oldGov: "القاهرة الكبرى", oldEnd: "2026-11-08", newLoc: "الحصري", newGov: "القاهرة الكبرى", landmark: "أمام جامع الحصري (الجيزة)", newStart: "2026-11-09", status: "ACTIVE", notes: "" },
    "976": { code: "976", ouCode: "wB01Vu010921", plate: "ج و ب 976", oldLoc: "الحصري", oldGov: "القاهرة الكبرى", oldEnd: "2026-11-08", newLoc: "مدرسة الشهيد محمد عادل - طنط الجزيرة - طوخ", newGov: "القاهرة الكبرى", landmark: "أمام المدرسة (القليوبية)", newStart: "2026-11-09", status: "ACTIVE", notes: "" },
    "542": { code: "542", ouCode: "wH08Vu010921", plate: "أ و ب 542", oldLoc: "شبشير الحصة - طنطا", oldGov: "الغربية", oldEnd: "2026-11-08", newLoc: "محلة زياد - سمنود", newGov: "الغربية", landmark: "مدخل القرية", newStart: "2026-11-09", status: "ACTIVE", notes: "" },
    "832": { code: "832", ouCode: "wA04Vu010921", plate: "ط و ب 832", oldLoc: "المكتب", oldGov: "القاهرة الكبرى", oldEnd: "2026-11-08", newLoc: "المكتب", newGov: "القاهرة الكبرى", landmark: "المكتب (إدارة الوحدات)", newStart: "2026-11-09", status: "ACTIVE", notes: "مربوط بشيت القاهرة الكبرى" },
    "2316": { code: "2316", ouCode: "wA29Vv010921", plate: "أ م ر 2316", oldLoc: "ميت أبو غالب - كفر سعد", oldGov: "دمياط", oldEnd: "2026-11-08", newLoc: "كفر سعد البلد - كفر سعد", newGov: "دمياط", landmark: "مدخل القرية", newStart: "2026-11-09", status: "ACTIVE", notes: "" },
  };
}

export default data;