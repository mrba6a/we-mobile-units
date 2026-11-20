// WE Mobile Units - Reconciliation Routes
import { Hono } from 'hono';
import { z } from 'zod';
import { asyncHandler, validateQuery } from '../middleware/errorHandler';
import { requirePermission } from '../middleware/auth';

type Bindings = {
  CACHE: KVNamespace;
  CAIRO_SCRIPT_URL: string;
  DELTA_SCRIPT_URL: string;
  UPPER_SCRIPT_URL: string;
  REPORTS_SCRIPT_URL: string;
  INTERNAL_SECRET: string;
};

const reconciliation = new Hono<{ Bindings: Bindings }>();

// Validation schemas
const reconciliationQuerySchema = z.object({
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  vanCode: z.string().optional(),
  governorate: z.string().optional(),
  basis: z.enum(['AUTO_BSS', 'MANUAL', 'VOICE']).default('AUTO_BSS'),
  mode: z.enum(['DAILY', 'CUMULATIVE_10D']).default('CUMULATIVE_10D'),
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(100),
});

const summaryQuerySchema = z.object({
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  vanCode: z.string().optional(),
  governorate: z.string().optional(),
});

// GET /api/reconciliation - Get reconciliation data
reconciliation.get(
  '/',
  validateQuery(reconciliationQuerySchema),
  requirePermission('reconciliation', 'read'),
  asyncHandler(async (c) => {
    const { dateFrom, dateTo, vanCode, governorate, basis, mode, page, pageSize } = c.get('validatedQuery');

    // TODO: Fetch from Apps Script /sheets unified endpoint
    // For now, generate mock reconciliation data
    const mockData = generateMockReconciliationData();

    let filtered = mockData;

    // Apply filters
    if (dateFrom) filtered = filtered.filter(d => d.date >= dateFrom);
    if (dateTo) filtered = filtered.filter(d => d.date <= dateTo);
    if (vanCode) filtered = filtered.filter(d => d.vanCode === vanCode);
    if (governorate) filtered = filtered.filter(d => d.governorate === governorate);

    // Apply reconciliation logic based on mode and basis
    let processed = filtered;
    if (mode === 'CUMULATIVE_10D') {
      processed = processCumulative10D(filtered);
    }

    // Apply basis filtering
    if (basis === 'AUTO_BSS') {
      processed = processed.filter(d => d.source === 'BSS');
    } else if (basis === 'MANUAL') {
      processed = processed.filter(d => d.source === 'MANUAL');
    } else if (basis === 'VOICE') {
      processed = processed.filter(d => d.source === 'VOICE');
    }

    const total = processed.length;
    const start = (page - 1) * pageSize;
    const paginated = processed.slice(start, start + pageSize);

    return c.json({
      success: true,
      data: paginated,
      meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize), mode, basis },
    });
  })
);

// GET /api/reconciliation/summary - Get reconciliation summary
reconciliation.get(
  '/summary',
  validateQuery(summaryQuerySchema),
  requirePermission('reconciliation', 'read'),
  asyncHandler(async (c) => {
    const { dateFrom, dateTo, vanCode, governorate } = c.get('validatedQuery');

    // TODO: Calculate from actual data
    const mockData = generateMockReconciliationData();

    let filtered = mockData;
    if (dateFrom) filtered = filtered.filter(d => d.date >= dateFrom);
    if (dateTo) filtered = filtered.filter(d => d.date <= dateTo);
    if (vanCode) filtered = filtered.filter(d => d.vanCode === vanCode);
    if (governorate) filtered = filtered.filter(d => d.governorate === governorate);

    const summary = calculateSummary(filtered);

    return c.json({ success: true, data: summary });
  })
);

// GET /api/reconciliation/:id - Get single reconciliation entry
reconciliation.get(
  '/:id',
  requirePermission('reconciliation', 'read'),
  asyncHandler(async (c) => {
    const id = c.req.param('id');

    // TODO: Fetch from Apps Script
    return c.json({
      success: true,
      data: {
        id,
        message: 'Reconciliation entry details would be fetched from Apps Script',
      },
    });
  })
);

// POST /api/reconciliation/recalculate - Trigger recalculation
reconciliation.post(
  '/recalculate',
  requirePermission('reconciliation', 'write'),
  asyncHandler(async (c) => {
    const { dateFrom, dateTo, vanCode } = await c.req.json();

    // TODO: Trigger Apps Script to recalculate
    // This would call the reconciliation engine in Apps Script

    return c.json({
      success: true,
      data: { message: 'Recalculation triggered', dateFrom, dateTo, vanCode },
    });
  })
);

// Helper functions
function generateMockReconciliationData() {
  const data = [];
  const vans = ['231', '582', '825', '832', '2348', '2349', '2347', '2346', '2357', '1896'];
  const governorates = ['المنوفية', 'القاهرة الكبرى', 'الإسكندرية', 'البحيرة', 'الشرقية'];
  const agents = [
    { id: '113985', name: 'ابانوب سليمان صافي مسعود' },
    { id: '113978', name: 'احمد عبد المحسن عبد الحميد' },
    { id: '113975', name: 'اشرف محمد حمدى حبشى حسين' },
    { id: '113982', name: 'عبد الرحمن أسامه محمد غنيم' },
  ];

  for (let i = 0; i < 100; i++) {
    const vanCode = vans[Math.floor(Math.random() * vans.length)];
    const agent = agents[Math.floor(Math.random() * agents.length)];
    const date = new Date(2026, 10, Math.floor(Math.random() * 10) + 1).toISOString().split('T')[0];
    const enteredAmount = Math.floor(Math.random() * 50000) + 5000;
    const bssAmount = enteredAmount + Math.floor(Math.random() * 1000) - 500;
    const difference = bssAmount - enteredAmount;

    let status: 'matched' | 'excess' | 'shortage' | 'pending' = 'matched';
    if (difference > 100) status = 'excess';
    else if (difference < -100) status = 'shortage';
    else if (Math.abs(difference) > 0) status = 'pending';

    data.push({
      id: `rec_${i}`,
      date,
      vanCode,
      location: getVanLocation(vanCode),
      governorate: getVanGovernorate(vanCode),
      agentName: agent.name,
      agentId: agent.id,
      bssEmpCode: `BSS_${agent.id}`,
      totalLines: Math.floor(Math.random() * 50) + 10,
      totalADSL: Math.floor(Math.random() * 5) + 1,
      enteredAmount,
      bssAmount,
      difference,
      status,
      source: ['BSS', 'MANUAL', 'VOICE'][Math.floor(Math.random() * 3)],
      mobileCash: Math.floor(enteredAmount * 0.6),
      mobileVisa: Math.floor(enteredAmount * 0.3),
      mobileExempt: Math.floor(enteredAmount * 0.1),
    });
  }

  return data;
}

function processCumulative10D(data: any[]) {
  // Group by vanCode + agentId across 10 days
  const grouped = new Map<string, any>();

  for (const entry of data) {
    const key = `${entry.vanCode}_${entry.agentId}`;
    if (!grouped.has(key)) {
      grouped.set(key, {
        ...entry,
        isCumulative10D: true,
        minDate: entry.date,
        maxDate: entry.date,
        daysSet: new Set([entry.date]),
        bssSessionsCount: 1,
        totalLines: entry.totalLines,
        totalADSL: entry.totalADSL,
        enteredAmount: entry.enteredAmount,
        bssAmount: entry.bssAmount,
        difference: entry.difference,
        mobileCash: entry.mobileCash,
        mobileVisa: entry.mobileVisa,
        mobileExempt: entry.mobileExempt,
      });
    } else {
      const group = grouped.get(key);
      group.daysSet.add(entry.date);
      group.minDate = entry.date < group.minDate ? entry.date : group.minDate;
      group.maxDate = entry.date > group.maxDate ? entry.date : group.maxDate;
      group.bssSessionsCount++;
      group.totalLines += entry.totalLines;
      group.totalADSL += entry.totalADSL;
      group.enteredAmount += entry.enteredAmount;
      group.bssAmount += entry.bssAmount;
      group.difference += entry.difference;
      group.mobileCash += entry.mobileCash;
      group.mobileVisa += entry.mobileVisa;
      group.mobileExempt += entry.mobileExempt;

      // Update status based on cumulative difference
      if (group.difference > 100) group.status = 'excess';
      else if (group.difference < -100) group.status = 'shortage';
      else if (Math.abs(group.difference) > 0) group.status = 'pending';
      else group.status = 'matched';
    }
  }

  return Array.from(grouped.values());
}

function calculateSummary(data: any[]) {
  const totalEntries = data.length;
  const matched = data.filter(d => d.status === 'matched').length;
  const excess = data.filter(d => d.status === 'excess').length;
  const shortage = data.filter(d => d.status === 'shortage').length;
  const pending = data.filter(d => d.status === 'pending').length;

  const totalEntered = data.reduce((sum, d) => sum + (d.enteredAmount || 0), 0);
  const totalBSS = data.reduce((sum, d) => sum + (d.bssAmount || 0), 0);
  const totalDifference = totalBSS - totalEntered;

  const byVan = data.reduce((acc, d) => {
    if (!acc[d.vanCode]) acc[d.vanCode] = { count: 0, entered: 0, bss: 0, diff: 0 };
    acc[d.vanCode].count++;
    acc[d.vanCode].entered += d.enteredAmount || 0;
    acc[d.vanCode].bss += d.bssAmount || 0;
    acc[d.vanCode].diff += d.difference || 0;
    return acc;
  }, {});

  const byGovernorate = data.reduce((acc, d) => {
    if (!acc[d.governorate]) acc[d.governorate] = { count: 0, entered: 0, bss: 0, diff: 0 };
    acc[d.governorate].count++;
    acc[d.governorate].entered += d.enteredAmount || 0;
    acc[d.governorate].bss += d.bssAmount || 0;
    acc[d.governorate].diff += d.difference || 0;
    return acc;
  }, {});

  return {
    totalEntries,
    matched,
    excess,
    shortage,
    pending,
    matchRate: totalEntries > 0 ? (matched / totalEntries * 100).toFixed(1) : 0,
    totalEntered,
    totalBSS,
    totalDifference,
    byVan: Object.entries(byVan).map(([vanCode, stats]) => ({ vanCode, ...stats })),
    byGovernorate: Object.entries(byGovernorate).map(([governorate, stats]) => ({ governorate, ...stats })),
  };
}

function getVanLocation(vanCode: string): string {
  const locations: Record<string, string> = {
    '231': 'شنشور - أشمون',
    '582': 'وصال / الحصري',
    '825': 'دجلة بالمز / كفر بطا',
    '832': 'المكتب',
    '2348': 'الرابعة الناصرية - ثان الرمل',
    '2349': 'سنطيس - دمنهور',
    '2347': 'رمسيس',
    '2346': 'الدقهلية',
    '2357': 'الأخصاص - كوبري الأخصاص',
    '1896': 'سنترال الشيخ زايد 1',
  };
  return locations[vanCode] || 'غير محدد';
}

function getVanGovernorate(vanCode: string): string {
  const govs: Record<string, string> = {
    '231': 'المنوفية',
    '582': 'القاهرة الكبرى',
    '825': 'القاهرة الكبرى',
    '832': 'القاهرة الكبرى',
    '2348': 'الإسكندرية',
    '2349': 'البحيرة',
    '2347': 'القاهرة الكبرى',
    '2346': 'الدقهلية',
    '2357': 'القاهرة الكبرى',
    '1896': 'القاهرة الكبرى',
  };
  return govs[vanCode] || 'القاهرة الكبرى';
}

export default reconciliation;