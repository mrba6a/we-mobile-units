// WE Mobile Units - Reports Routes
import { Hono } from 'hono';
import { z } from 'zod';
import { asyncHandler, validateQuery } from '../middleware/errorHandler';
import { requirePermission } from '../middleware/auth';
import { buildFinalSheetFromWhatsApp, generateMockWhatsAppReports } from './whatsapp';

type Bindings = {
  CACHE: KVNamespace;
  CAIRO_SCRIPT_URL: string;
  DELTA_SCRIPT_URL: string;
  UPPER_SCRIPT_URL: string;
  REPORTS_SCRIPT_URL: string;
  INTERNAL_SECRET: string;
};

const reports = new Hono<{ Bindings: Bindings }>();

// Validation schemas
const monthlyQuerySchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/), // YYYY-MM
  vanCode: z.string().optional(),
  governorate: z.string().optional(),
  agentId: z.string().optional(),
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(100),
});

const historicalQuerySchema = z.object({
  dateFrom: z.string(),
  dateTo: z.string(),
  vanCode: z.string().optional(),
  governorate: z.string().optional(),
  period: z.enum(['daily', 'monthly', 'yearly']).default('daily'),
  groupBy: z.enum(['van', 'agent', 'governorate', 'category']).default('van'),
});

const finalSheetQuerySchema = z.object({
  dateFrom: z.string(),
  dateTo: z.string(),
  vanCode: z.string().optional(),
  governorate: z.string().optional(),
  status: z.enum(['all', 'matched', 'excess', 'shortage']).default('all'),
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(100),
});

const buildFinalSheetSchema = z.object({
  dateFrom: z.string(),
  dateTo: z.string(),
  vanCode: z.string().optional(),
  governorate: z.string().optional(),
});

const exportQuerySchema = z.object({
  type: z.enum(['monthly', 'historical', 'final-sheet', 'reconciliation']),
  dateFrom: z.string(),
  dateTo: z.string(),
  vanCode: z.string().optional(),
  governorate: z.string().optional(),
  format: z.enum(['csv', 'excel', 'pdf']).default('csv'),
});

// GET /api/reports/monthly - Monthly sales report
reports.get(
  '/monthly',
  validateQuery(monthlyQuerySchema),
  requirePermission('monthly', 'read'),
  asyncHandler(async (c) => {
    const { month, vanCode, governorate, agentId, page, pageSize } = c.get('validatedQuery');

    const res = await api.getMonthlyReport({
      month,
      vanCode: filters.vanCode || undefined,
      governorate: filters.governorate || undefined,
      agentId: filters.agentId || undefined,
      page: filters.page,
      pageSize: filters.pageSize,
    });
    if (!res.success) throw new Error(res.error);
    return res.data as { data: MonthlyReportEntry[]; meta: { total: number; page: number; pageSize: number; totalPages: number } };
  })
);

// GET /api/reports/historical - Historical trends report
reports.get(
  '/historical',
  validateQuery(historicalQuerySchema),
  requirePermission('historical', 'read'),
  asyncHandler(async (c) => {
    const { dateFrom, dateTo, vanCode, governorate, period, groupBy } = c.get('validatedQuery');

    const res = await api.getHistoricalReport({
      dateFrom,
      dateTo,
      vanCode: filters.vanCode || undefined,
      governorate: filters.governorate || undefined,
      period: filters.period,
    });
    if (!res.success) throw new Error(res.error);
    return res.data as HistoricalReportEntry[];
  })
);

// GET /api/reports/final-sheet - Final reconciled sheet (ready for finance)
reports.get(
  '/final-sheet',
  validateQuery(finalSheetQuerySchema),
  requirePermission('reports', 'read'),
  asyncHandler(async (c) => {
    const { dateFrom, dateTo, vanCode, governorate, status, page, pageSize } = c.get('validatedQuery');

    // 1. Fetch automatic sheet data from Apps Script
    const autoRes = await fetchUnifiedSheets(c.env, dateFrom, dateTo, vanCode, governorate);
    if (!autoRes.success) throw new Error(autoRes.error);

    // 2. Fetch WhatsApp reports for the period
    const waReports = generateMockWhatsAppReports(); // TODO: Fetch from cache/Apps Script

    // 3. Build Final Sheet: Auto + WhatsApp
    const finalSheet = await buildFinalSheetFromWhatsApp(c.env, autoRes.data, waReports);

    // Apply status filter
    let filtered = finalSheet;
    if (status !== 'all') {
      const statusMap: Record<string, string> = {
        matched: 'توريد مطابق',
        excess: 'توريد زياده',
        shortage: 'توريد ناقص',
      };
      filtered = filtered.filter(r => r.supplyStatus === statusMap[status]);
    }

    // Apply van/governorate filters
    if (vanCode) filtered = filtered.filter(r => r.unitNo === vanCode || r['Unit NO'] === vanCode);
    if (governorate) filtered = filtered.filter(r => r.city === governorate);

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

// POST /api/reports/final-sheet/build - Build/Rebuild Final Sheet
reports.post(
  '/final-sheet/build',
  requirePermission('reports', 'write'),
  validateBody(buildFinalSheetSchema),
  asyncHandler(async (c) => {
    const { dateFrom, dateTo, vanCode, governorate } = c.get('validatedBody');

    // 1. Fetch automatic sheet data
    const autoRes = await fetchUnifiedSheets(c.env, dateFrom, dateTo, vanCode, governorate);
    if (!autoRes.success) throw new Error(autoRes.error);

    // 2. Fetch WhatsApp reports
    const waReports = generateMockWhatsAppReports(); // TODO: from cache

    // 3. Build Final Sheet
    const finalSheet = await buildFinalSheetFromWhatsApp(c.env, autoRes.data, waReports);

    // 3. Save to Apps Script /sheets
    // TODO: Save to Reports Sheet

    return c.json({
      success: true,
      data: {
        message: 'تم بناء الشيت النهائي بنجاح',
        totalRows: finalSheet.length,
        dateRange: { from: dateFrom, to: dateTo },
        stats: {
          total: finalSheet.length,
          matched: finalSheet.filter(r => r.supplyStatus === 'توريد مطابق').length,
          excess: finalSheet.filter(r => r.supplyStatus === 'توريد زياده').length,
          shortage: finalSheet.filter(r => r.supplyStatus === 'توريد ناقص').length,
          whatsappVerified: finalSheet.filter(r => r.whatsappVerified).length,
        },
      },
    });
  })
);

// GET /api/reports/master-preview - Master 22-column preview
reports.get(
  '/master-preview',
  validateQuery(z.object({
    dateFrom: z.string(),
    dateTo: z.string(),
    vanCode: z.string().optional(),
  })),
  requirePermission('reports', 'read'),
  asyncHandler(async (c) => {
    const { dateFrom, dateTo, vanCode } = c.get('validatedQuery');

    const res = await api.getFinalSheet({
      dateFrom,
      dateTo,
      vanCode: vanCode || undefined,
    });
    if (!res.success) throw new Error(res.error);

    return c.json({
      success: true,
      data: {
        message: 'Master 22-column preview would be generated from Apps Script',
        columns: [
          'Date', 'Month', 'City', 'Location', 'Unit NO',
          'Total Lines', '5at 3ady', 'Talabh', 'Takafol', 'MNP', 'Ghaz',
          'Net', '2rdy', 'Mobile Amount', 'Voice Bills', 'Voice Amount',
          'OSS', 'We Pay', 'البارز', 'Total', 'النظام',
          'حالة التوريد', 'توريد الخزينة'
        ],
        preview: [],
      },
    });
  })
);

// POST /api/reports/export - Export report
reports.post(
  '/export',
  validateQuery(exportQuerySchema),
  requirePermission('reports', 'export'),
  asyncHandler(async (c) => {
    const { type, dateFrom, dateTo, vanCode, governorate, format } = c.get('validatedQuery');

    const filename = `${type}_${dateFrom}_to_${dateTo}${vanCode ? `_${vanCode}` : ''}.${format}`;

    return c.json({
      success: true,
      data: {
        filename,
        downloadUrl: `/api/reports/download/${filename}`,
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        message: `Export ${format.toUpperCase()} would be generated and available for download`,
      },
    });
  })
);

// GET /api/reports/dashboard - Reports dashboard
reports.get(
  '/dashboard',
  validateQuery(z.object({
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
  })),
  requirePermission('reports', 'read'),
  asyncHandler(async (c) => {
    const { dateFrom, dateTo } = c.get('validatedQuery');

    return c.json({
      success: true,
      data: {
        period: { from: dateFrom || '2026-11-01', to: dateTo || '2026-11-10' },
        monthlySummary: [
          { month: '2026-11', totalAmount: 15500000, totalLines: 45000, totalADSL: 1200, vans: 33 },
          { month: '2026-10', totalAmount: 14800000, totalLines: 43000, totalADSL: 1150, vans: 32 },
        ],
        topPerformers: [
          { vanCode: '825', location: 'دجلة بالمز', amount: 2500000, lines: 8500 },
          { vanCode: '2348', location: 'الرابعة الناصرية', amount: 1800000, lines: 6200 },
          { vanCode: '582', location: 'وصال', amount: 1650000, lines: 5800 },
        ],
        supplyStatus: {
          matched: 285,
          excess: 42,
          shortage: 18,
        },
        trends: {
          amount: [14800000, 15200000, 15500000, 15800000, 15500000],
          lines: [43000, 44000, 45000, 46000, 45000],
        },
      },
    });
  })
);

// ==================== Helper Functions ====================

async function fetchUnifiedSheets(env: any, dateFrom: string, dateTo: string, vanCode?: string, governorate?: string) {
  // Fetch from all 3 sectors in parallel
  const [cairoRes, deltaRes, upperRes] = await Promise.allSettled([
    fetch(env.CAIRO_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Internal-Secret': env.INTERNAL_SECRET },
      body: JSON.stringify({ action: 'getRange', dateFrom, dateTo, vanCode, governorate }),
    }),
    fetch(env.DELTA_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Internal-Secret': env.INTERNAL_SECRET },
      body: JSON.stringify({ action: 'getRange', dateFrom, dateTo, vanCode, governorate }),
    }),
    fetch(env.UPPER_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Internal-Secret': env.INTERNAL_SECRET },
      body: JSON.stringify({ action: 'getRange', dateFrom, dateTo, vanCode, governorate }),
    }),
  ]);

  const allData = [];
  for (const res of [cairoRes, deltaRes, upperRes]) {
    if (res.status === 'fulfilled' && res.value.ok) {
      const data = await res.value.json();
      if (data.data) allData.push(...data.data);
    }
  }

  return { success: true, data: allData };
}

function generateMockWhatsAppReports() {
  const data = [];
  const vans = ['231', '582', '825', '832', '2348', '2349', '2347', '2346', '2357', '1896'];

  for (let i = 0; i < 100; i++) {
    const vanCode = vans[Math.floor(Math.random() * vans.length)];
    const date = new Date(2026, 10, Math.floor(Math.random() * 10) + 1).toISOString().split('T')[0];
    const parsed = Math.random() > 0.1;
    const verified = parsed && Math.random() > 0.15;

    data.push({
      id: `wa_${i}`,
      date,
      groupName: `مجموعة ${vanCode}`,
      vanCode,
      location: getVanLocation(vanCode),
      rawText: parsed ? 'Parsed report text...' : 'Raw unparsed text...',
      parsedData: parsed ? {
        vanCode,
        location: getVanLocation(vanCode),
        sales: { mobile: Math.floor(Math.random() * 50), landContracts: Math.floor(Math.random() * 5) },
        devices: { weAir: Math.floor(Math.random() * 3), ont: Math.floor(Math.random() * 2) },
        amounts: {
          cashTotal: Math.floor(Math.random() * 50000),
          cashSafeBankName: 'شبرا مصر',
          visaTotal: Math.floor(Math.random() * 20000),
          visaMobileBranch: 'محمول (القبة)',
          totalMobile: Math.floor(Math.random() * 50000),
          barz: Math.floor(Math.random() * 1000),
          totalSupply: Math.floor(Math.random() * 60000),
        },
        agents: [],
        remainingStock: {},
        notes: '',
        verified,
        verifiedAt: new Date().toISOString(),
      } : null,
      importedAt: new Date().toISOString(),
      importedBy: 'system',
      verified,
    });
  }

  return data;
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

export default reports;