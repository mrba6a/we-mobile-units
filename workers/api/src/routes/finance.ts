// WE Mobile Units - Finance/BSS Routes
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

const finance = new Hono<{ Bindings: Bindings }>();

// Validation schemas
const financeQuerySchema = z.object({
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  vanCode: z.string().optional(),
  governorate: z.string().optional(),
  agentId: z.string().optional(),
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(100),
});

const comparisonQuerySchema = z.object({
  dateFrom: z.string(),
  dateTo: z.string(),
  vanCode: z.string().optional(),
  governorate: z.string().optional(),
  groupBy: z.enum(['van', 'agent', 'governorate', 'date']).default('van'),
});

// GET /api/finance/bss - Get BSS data
finance.get(
  '/bss',
  validateQuery(financeQuerySchema),
  requirePermission('finance', 'read'),
  asyncHandler(async (c) => {
    const { dateFrom, dateTo, vanCode, governorate, agentId, page, pageSize } = c.get('validatedQuery');

    // TODO: Fetch from Apps Script /sheets unified endpoint
    const mockData = generateMockBSSData();

    let filtered = mockData;
    if (dateFrom) filtered = filtered.filter(d => d.date >= dateFrom);
    if (dateTo) filtered = filtered.filter(d => d.date <= dateTo);
    if (vanCode) filtered = filtered.filter(d => d.vanCode === vanCode);
    if (governorate) filtered = filtered.filter(d => d.governorate === governorate);
    if (agentId) filtered = filtered.filter(d => d.agentId === agentId);

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

// GET /api/finance/comparison - Compare entered vs BSS
finance.get(
  '/comparison',
  validateQuery(comparisonQuerySchema),
  requirePermission('finance', 'read'),
  asyncHandler(async (c) => {
    const { dateFrom, dateTo, vanCode, governorate, groupBy } = c.get('validatedQuery');

    // TODO: Fetch both entered data and BSS data, then compare
    const enteredData = generateMockEnteredData();
    const bssData = generateMockBSSData();

    let filteredEntered = enteredData.filter(d => d.date >= dateFrom && d.date <= dateTo);
    let filteredBSS = bssData.filter(d => d.date >= dateFrom && d.date <= dateTo);

    if (vanCode) {
      filteredEntered = filteredEntered.filter(d => d.vanCode === vanCode);
      filteredBSS = filteredBSS.filter(d => d.vanCode === vanCode);
    }
    if (governorate) {
      filteredEntered = filteredEntered.filter(d => d.governorate === governorate);
      filteredBSS = filteredBSS.filter(d => d.governorate === governorate);
    }

    const comparison = performComparison(filteredEntered, filteredBSS, groupBy);

    return c.json({ success: true, data: comparison });
  })
);

// GET /api/finance/discrepancies - Get discrepancies only
finance.get(
  '/discrepancies',
  validateQuery(financeQuerySchema),
  requirePermission('finance', 'read'),
  asyncHandler(async (c) => {
    const { dateFrom, dateTo, vanCode, governorate, page, pageSize } = c.get('validatedQuery');

    const enteredData = generateMockEnteredData();
    const bssData = generateMockBSSData();

    let filteredEntered = enteredData.filter(d => d.date >= dateFrom && d.date <= dateTo);
    let filteredBSS = bssData.filter(d => d.date >= dateFrom && d.date <= dateTo);

    if (vanCode) {
      filteredEntered = filteredEntered.filter(d => d.vanCode === vanCode);
      filteredBSS = filteredBSS.filter(d => d.vanCode === vanCode);
    }
    if (governorate) {
      filteredEntered = filteredEntered.filter(d => d.governorate === governorate);
      filteredBSS = filteredBSS.filter(d => d.governorate === governorate);
    }

    const discrepancies = findDiscrepancies(filteredEntered, filteredBSS);

    const total = discrepancies.length;
    const start = (page - 1) * pageSize;
    const paginated = discrepancies.slice(start, start + pageSize);

    return c.json({
      success: true,
      data: paginated,
      meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
    });
  })
);

// GET /api/finance/dashboard - Finance dashboard summary
finance.get(
  '/dashboard',
  validateQuery(z.object({
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    vanCode: z.string().optional(),
    governorate: z.string().optional(),
  })),
  requirePermission('finance', 'read'),
  asyncHandler(async (c) => {
    const { dateFrom, dateTo, vanCode, governorate } = c.get('validatedQuery');

    const enteredData = generateMockEnteredData();
    const bssData = generateMockBSSData();

    let filteredEntered = enteredData.filter(d => d.date >= (dateFrom || '2026-11-01') && d.date <= (dateTo || '2026-11-10'));
    let filteredBSS = bssData.filter(d => d.date >= (dateFrom || '2026-11-01') && d.date <= (dateTo || '2026-11-10'));

    if (vanCode) {
      filteredEntered = filteredEntered.filter(d => d.vanCode === vanCode);
      filteredBSS = filteredBSS.filter(d => d.vanCode === vanCode);
    }
    if (governorate) {
      filteredEntered = filteredEntered.filter(d => d.governorate === governorate);
      filteredBSS = filteredBSS.filter(d => d.governorate === governorate);
    }

    const dashboard = generateDashboard(filteredEntered, filteredBSS);

    return c.json({ success: true, data: dashboard });
  })
);

// Helper functions
function generateMockBSSData() {
  const data = [];
  const vans = ['231', '582', '825', '832', '2348', '2349'];
  const agents = [
    { id: '113985', name: 'ابانوب سليمان صافي مسعود' },
    { id: '113978', name: 'احمد عبد المحسن عبد الحميد' },
    { id: '113975', name: 'اشرف محمد حمدى حبشى حسين' },
  ];

  for (let i = 0; i < 200; i++) {
    const vanCode = vans[Math.floor(Math.random() * vans.length)];
    const agent = agents[Math.floor(Math.random() * agents.length)];
    const date = new Date(2026, 10, Math.floor(Math.random() * 10) + 1).toISOString().split('T')[0];

    data.push({
      id: `bss_${i}`,
      date,
      vanCode,
      location: getVanLocation(vanCode),
      governorate: getVanGovernorate(vanCode),
      agentId: agent.id,
      agentName: agent.name,
      sessionId: `SESS_${Math.floor(Math.random() * 1000000)}`,
      lines: Math.floor(Math.random() * 30) + 5,
      adsl: Math.floor(Math.random() * 3),
      amount: Math.floor(Math.random() * 40000) + 10000,
      cash: Math.floor(Math.random() * 25000) + 5000,
      visa: Math.floor(Math.random() * 10000),
      exempt: Math.floor(Math.random() * 5000),
      source: 'BSS',
    });
  }

  return data;
}

function generateMockEnteredData() {
  const data = [];
  const vans = ['231', '582', '825', '832', '2348', '2349'];
  const agents = [
    { id: '113985', name: 'ابانوب سليمان صافي مسعود' },
    { id: '113978', name: 'احمد عبد المحسن عبد الحميد' },
    { id: '113975', name: 'اشرف محمد حمدى حبشى حسين' },
  ];

  for (let i = 0; i < 150; i++) {
    const vanCode = vans[Math.floor(Math.random() * vans.length)];
    const agent = agents[Math.floor(Math.random() * agents.length)];
    const date = new Date(2026, 10, Math.floor(Math.random() * 10) + 1).toISOString().split('T')[0];

    data.push({
      id: `ent_${i}`,
      date,
      vanCode,
      location: getVanLocation(vanCode),
      governorate: getVanGovernorate(vanCode),
      agentId: agent.id,
      agentName: agent.name,
      totalLines: Math.floor(Math.random() * 30) + 5,
      totalADSL: Math.floor(Math.random() * 3),
      amount: Math.floor(Math.random() * 40000) + 10000,
      mobileCash: Math.floor(Math.random() * 25000) + 5000,
      mobileVisa: Math.floor(Math.random() * 10000),
      mobileExempt: Math.floor(Math.random() * 5000),
      source: 'MANUAL',
    });
  }

  return data;
}

function performComparison(entered: any[], bss: any[], groupBy: string) {
  // Create maps for comparison
  const enteredMap = new Map<string, any>();
  const bssMap = new Map<string, any>();

  // Group by the specified key
  const getKey = (d: any) => {
    switch (groupBy) {
      case 'van': return d.vanCode;
      case 'agent': return d.agentId;
      case 'governorate': return d.governorate;
      case 'date': return d.date;
      default: return d.vanCode;
    }
  };

  // Aggregate entered data
  for (const d of entered) {
    const key = getKey(d);
    if (!enteredMap.has(key)) {
      enteredMap.set(key, { ...d, enteredAmount: 0, enteredLines: 0, enteredADSL: 0, count: 0 });
    }
    const agg = enteredMap.get(key);
    agg.enteredAmount += d.amount || 0;
    agg.enteredLines += d.totalLines || 0;
    agg.enteredADSL += d.totalADSL || 0;
    agg.count++;
  }

  // Aggregate BSS data
  for (const d of bss) {
    const key = getKey(d);
    if (!bssMap.has(key)) {
      bssMap.set(key, { ...d, bssAmount: 0, bssLines: 0, bssADSL: 0, count: 0 });
    }
    const agg = bssMap.get(key);
    agg.bssAmount += d.amount || 0;
    agg.bssLines += d.lines || 0;
    agg.bssADSL += d.adsl || 0;
    agg.count++;
  }

  // Compare
  const allKeys = new Set([...enteredMap.keys(), ...bssMap.keys()]);
  const results = [];

  for (const key of allKeys) {
    const ent = enteredMap.get(key);
    const bss = bssMap.get(key);

    const enteredAmount = ent?.enteredAmount || 0;
    const bssAmount = bss?.bssAmount || 0;
    const difference = bssAmount - enteredAmount;

    let status: 'matched' | 'excess' | 'shortage' = 'matched';
    if (difference > 100) status = 'excess';
    else if (difference < -100) status = 'shortage';

    results.push({
      key,
      groupBy,
      enteredAmount,
      bssAmount,
      difference,
      status,
      enteredLines: ent?.enteredLines || 0,
      bssLines: bss?.bssLines || 0,
      enteredADSL: ent?.enteredADSL || 0,
      bssADSL: bss?.bssADSL || 0,
      enteredCount: ent?.count || 0,
      bssCount: bss?.count || 0,
      vanCode: ent?.vanCode || bss?.vanCode,
      governorate: ent?.governorate || bss?.governorate,
      agentId: ent?.agentId || bss?.agentId,
      agentName: ent?.agentName || bss?.agentName,
    });
  }

  return {
    summary: {
      totalGroups: results.length,
      matched: results.filter(r => r.status === 'matched').length,
      excess: results.filter(r => r.status === 'excess').length,
      shortage: results.filter(r => r.status === 'shortage').length,
      totalEnteredAmount: results.reduce((s, r) => s + r.enteredAmount, 0),
      totalBSSAmount: results.reduce((s, r) => s + r.bssAmount, 0),
      totalDifference: results.reduce((s, r) => s + r.difference, 0),
    },
    details: results,
  };
}

function findDiscrepancies(entered: any[], bss: any[]) {
  // Simple key-based matching
  const bssMap = new Map<string, any>();

  for (const d of bss) {
    const key = `${d.date}_${d.vanCode}_${d.agentId}`;
    bssMap.set(key, d);
  }

  const discrepancies = [];

  for (const d of entered) {
    const key = `${d.date}_${d.vanCode}_${d.agentId}`;
    const bssEntry = bssMap.get(key);

    if (!bssEntry) {
      discrepancies.push({
        type: 'missing_in_bss',
        entered: d,
        bss: null,
        severity: 'high',
      });
    } else {
      const amountDiff = bssEntry.amount - d.amount;
      if (Math.abs(amountDiff) > 100) {
        discrepancies.push({
          type: amountDiff > 0 ? 'excess_in_bss' : 'shortage_in_bss',
          entered: d,
          bss: bssEntry,
          difference: amountDiff,
          severity: Math.abs(amountDiff) > 1000 ? 'high' : 'medium',
        });
      }
    }
  }

  // Check for BSS entries not in entered
  const enteredMap = new Map<string, any>();
  for (const d of entered) {
    const key = `${d.date}_${d.vanCode}_${d.agentId}`;
    enteredMap.set(key, d);
  }

  for (const d of bss) {
    const key = `${d.date}_${d.vanCode}_${d.agentId}`;
    if (!enteredMap.has(key)) {
      discrepancies.push({
        type: 'missing_in_entered',
        entered: null,
        bss: d,
        severity: 'medium',
      });
    }
  }

  return discrepancies;
}

function generateDashboard(entered: any[], bss: any[]) {
  const totalEnteredAmount = entered.reduce((s, d) => s + (d.amount || 0), 0);
  const totalBSSAmount = bss.reduce((s, d) => s + (d.amount || 0), 0);

  return {
    period: { from: '2026-11-01', to: '2026-11-10' },
    totals: {
      enteredAmount: totalEnteredAmount,
      bssAmount: totalBSSAmount,
      difference: totalBSSAmount - totalEnteredAmount,
      matchRate: totalEnteredAmount > 0 ? ((totalEnteredAmount / totalBSSAmount) * 100).toFixed(1) : 0,
    },
    byCategory: {
      mobile: {
        entered: entered.reduce((s, d) => s + (d.mobileCash || 0) + (d.mobileVisa || 0) + (d.mobileExempt || 0), 0),
        bss: bss.reduce((s, d) => s + (d.cash || 0) + (d.visa || 0) + (d.exempt || 0), 0),
      },
      adsl: {
        entered: entered.filter(d => (d.totalADSL || 0) > 0).length,
        bss: bss.filter(d => (d.adsl || 0) > 0).length,
      },
      devices: {
        entered: 0, // Would need device data
        bss: 0,
      },
    },
    byGovernorate: [
      { governorate: 'القاهرة الكبرى', entered: 1250000, bss: 1245000, diff: -5000 },
      { governorate: 'الإسكندرية', entered: 450000, bss: 452000, diff: 2000 },
      { governorate: 'المنوفية', entered: 320000, bss: 318000, diff: -2000 },
      { governorate: 'البحيرة', entered: 280000, bss: 281000, diff: 1000 },
    ],
    topDiscrepancies: [
      { vanCode: '2348', agent: 'محمد السيد طه', diff: 5000, type: 'excess' },
      { vanCode: '582', agent: 'عمرو محمد', diff: -3000, type: 'shortage' },
    ],
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
  };
  return govs[vanCode] || 'القاهرة الكبرى';
}

export default finance;