// WE Mobile Units - Google Sheets Proxy Routes
import { Hono } from 'hono';
import { z } from 'zod';
import { asyncHandler, validateBody } from '../middleware/errorHandler';

type Bindings = {
  CAIRO_SCRIPT_URL: string;
  DELTA_SCRIPT_URL: string;
  UPPER_SCRIPT_URL: string;
  REPORTS_SCRIPT_URL: string;
  INTERNAL_SECRET: string;
};

const sheets = new Hono<{ Bindings: Bindings }>();

// Validation schemas
const writeSheetSchema = z.object({
  sheetType: z.enum(['cairo', 'delta', 'upper', 'reports', 'backup']),
  action: z.enum(['append', 'update', 'get', 'delete']),
  data: z.record(z.any()),
  filters: z.record(z.any()).optional(),
});

const batchWriteSchema = z.object({
  operations: z.array(z.object({
    sheetType: z.enum(['cairo', 'delta', 'upper', 'reports', 'backup']),
    action: z.enum(['append', 'update']),
    data: z.record(z.any()),
  })),
});

// GET /api/sheets/health - Check all script endpoints
sheets.get(
  '/health',
  asyncHandler(async (c) => {
    const urls = {
      cairo: c.env.CAIRO_SCRIPT_URL,
      delta: c.env.DELTA_SCRIPT_URL,
      upper: c.env.UPPER_SCRIPT_URL,
      reports: c.env.REPORTS_SCRIPT_URL,
    };

    const results = await Promise.allSettled(
      Object.entries(urls).map(async ([name, url]) => {
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Internal-Secret': c.env.INTERNAL_SECRET,
            },
            body: JSON.stringify({ action: 'health' }),
            signal: AbortSignal.timeout(5000),
          });
          return { name, status: response.ok ? 'healthy' : 'unhealthy', statusCode: response.status };
        } catch (err) {
          return { name, status: 'error', error: err instanceof Error ? err.message : 'Unknown error' };
        }
      })
    );

    return c.json({
      success: true,
      data: results.map(r => r.status === 'fulfilled' ? r.value : { name: 'unknown', status: 'error', error: r.reason }),
    });
  })
);

// POST /api/sheets/write - Write to specific sheet
sheets.post(
  '/write',
  validateBody(writeSheetSchema),
  asyncHandler(async (c) => {
    const { sheetType, action, data, filters } = c.get('validatedBody');

    const scriptUrls: Record<string, string> = {
      cairo: c.env.CAIRO_SCRIPT_URL,
      delta: c.env.DELTA_SCRIPT_URL,
      upper: c.env.UPPER_SCRIPT_URL,
      reports: c.env.REPORTS_SCRIPT_URL,
    };

    const url = scriptUrls[sheetType];
    if (!url) {
      return c.json({ success: false, error: 'Invalid sheet type' }, 400);
    }

    const payload = {
      action,
      data,
      filters,
      timestamp: new Date().toISOString(),
      source: 'we-mobile-units-api',
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Secret': c.env.INTERNAL_SECRET,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      return c.json(
        { success: false, error: result.error || 'Failed to write to sheet', details: result },
        response.status
      );
    }

    return c.json({ success: true, data: result });
  })
);

// POST /api/sheets/batch - Batch write operations
sheets.post(
  '/batch',
  validateBody(batchWriteSchema),
  asyncHandler(async (c) => {
    const { operations } = c.get('validatedBody');

    const scriptUrls: Record<string, string> = {
      cairo: c.env.CAIRO_SCRIPT_URL,
      delta: c.env.DELTA_SCRIPT_URL,
      upper: c.env.UPPER_SCRIPT_URL,
      reports: c.env.REPORTS_SCRIPT_URL,
    };

    const results = await Promise.allSettled(
      operations.map(async (op) => {
        const url = scriptUrls[op.sheetType];
        if (!url) throw new Error(`Invalid sheet type: ${op.sheetType}`);

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Internal-Secret': c.env.INTERNAL_SECRET,
          },
          body: JSON.stringify({
            action: op.action,
            data: op.data,
            timestamp: new Date().toISOString(),
            source: 'we-mobile-units-api',
          }),
        });

        return { sheetType: op.sheetType, action: op.action, result: await response.json() };
      })
    );

    return c.json({
      success: true,
      data: results.map((r, i) =>
        r.status === 'fulfilled'
          ? { ...r.value, success: true }
          : { sheetType: operations[i].sheetType, success: false, error: r.reason?.message }
      ),
    });
  })
);

// GET /api/sheets/read - Read from sheet with filters
sheets.get(
  '/read',
  asyncHandler(async (c) => {
    const sheetType = c.req.query('sheetType');
    const action = c.req.query('action') || 'get';
    const filters = c.req.query('filters') ? JSON.parse(c.req.query('filters')!) : {};
    const limit = parseInt(c.req.query('limit') || '1000');
    const offset = parseInt(c.req.query('offset') || '0');

    if (!sheetType || !['cairo', 'delta', 'upper', 'reports'].includes(sheetType)) {
      return c.json({ success: false, error: 'Invalid sheet type' }, 400);
    }

    const scriptUrls: Record<string, string> = {
      cairo: c.env.CAIRO_SCRIPT_URL,
      delta: c.env.DELTA_SCRIPT_URL,
      upper: c.env.UPPER_SCRIPT_URL,
      reports: c.env.REPORTS_SCRIPT_URL,
    };

    const url = scriptUrls[sheetType];
    const payload = { action, filters, limit, offset };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Secret': c.env.INTERNAL_SECRET,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      return c.json({ success: false, error: result.error || 'Failed to read from sheet' }, response.status);
    }

    return c.json({ success: true, data: result });
  })
);

// POST /api/sheets/sync-archive - Trigger archive sync (run daily)
sheets.post(
  '/sync-archive',
  asyncHandler(async (c) => {
    // This would trigger the Apps Script to sync data from 3 sectors to archive sheet
    const payload = {
      action: 'syncArchive',
      date: new Date().toISOString().split('T')[0],
      source: 'we-mobile-units-api',
    };

    const results = await Promise.allSettled([
      fetch(c.env.CAIRO_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Internal-Secret': c.env.INTERNAL_SECRET },
        body: JSON.stringify(payload),
      }),
      fetch(c.env.DELTA_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Internal-Secret': c.env.INTERNAL_SECRET },
        body: JSON.stringify(payload),
      }),
      fetch(c.env.UPPER_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Internal-Secret': c.env.INTERNAL_SECRET },
        body: JSON.stringify(payload),
      }),
    ]);

    return c.json({
      success: true,
      data: results.map((r, i) => {
        const sectors = ['cairo', 'delta', 'upper'];
        return r.status === 'fulfilled'
          ? { sector: sectors[i], success: r.value.ok }
          : { sector: sectors[i], success: false, error: r.reason?.message };
      }),
    });
  })
);

// GET /api/sheets/unified - Get unified data from all sectors
sheets.get(
  '/unified',
  asyncHandler(async (c) => {
    const dateFrom = c.req.query('dateFrom');
    const dateTo = c.req.query('dateTo');
    const vanCode = c.req.query('vanCode');
    const governorate = c.req.query('governorate');

    if (!dateFrom || !dateTo) {
      return c.json({ success: false, error: 'dateFrom and dateTo are required' }, 400);
    }

    const scriptUrls = {
      cairo: c.env.CAIRO_SCRIPT_URL,
      delta: c.env.DELTA_SCRIPT_URL,
      upper: c.env.UPPER_SCRIPT_URL,
    };

    const payload = {
      action: 'getRange',
      dateFrom,
      dateTo,
      vanCode,
      governorate,
    };

    const results = await Promise.allSettled(
      Object.entries(scriptUrls).map(async ([sector, url]) => {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Internal-Secret': c.env.INTERNAL_SECRET },
          body: JSON.stringify(payload),
        });
        return { sector, data: await response.json() };
      })
    );

    // Merge results
    const allData = results
      .filter(r => r.status === 'fulfilled')
      .flatMap(r => r.value.data?.data || []);

    // Filter by vanCode/governorate if provided
    let filtered = allData;
    if (vanCode) {
      filtered = filtered.filter((row: any) => row.vanCode === vanCode || row['Unit NO'] === vanCode);
    }
    if (governorate) {
      filtered = filtered.filter((row: any) => row.governorate === governorate || row.City === governorate);
    }

    return c.json({
      success: true,
      data: filtered,
      meta: {
        total: filtered.length,
        dateFrom,
        dateTo,
        sectors: Object.keys(scriptUrls),
      },
    });
  })
);

export default sheets;