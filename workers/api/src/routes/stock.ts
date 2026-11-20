// WE Mobile Units - Stock Routes
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

const stock = new Hono<{ Bindings: Bindings }>();

// Validation schemas
const stockQuerySchema = z.object({
  vanCode: z.string().optional(),
  governorate: z.string().optional(),
  category: z.string().optional(),
  lowStock: z.coerce.boolean().default(false),
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(100),
});

const stockItemSchema = z.object({
  vanCode: z.string(),
  category: z.string(),
  product: z.string(),
  quantity: z.number().int().min(0),
  minQuantity: z.number().int().min(0).default(10),
  unit: z.string().default('قطعة'),
});

const transferSchema = z.object({
  fromVanCode: z.string(),
  toVanCode: z.string(),
  items: z.array(z.object({
    product: z.string(),
    quantity: z.number().int().min(1),
  })),
  notes: z.string().optional(),
});

// GET /api/stock - List stock items
stock.get(
  '/',
  validateQuery(stockQuerySchema),
  requirePermission('stock', 'read'),
  asyncHandler(async (c) => {
    const { vanCode, governorate, category, lowStock, page, pageSize } = c.get('validatedQuery');

    // TODO: Fetch from Apps Script or cache
    const mockData = generateMockStockData();

    let filtered = mockData;
    if (vanCode) filtered = filtered.filter(d => d.vanCode === vanCode);
    if (governorate) filtered = filtered.filter(d => d.governorate === governorate);
    if (category) filtered = filtered.filter(d => d.category === category);
    if (lowStock) filtered = filtered.filter(d => d.quantity <= d.minQuantity);

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

// POST /api/stock - Add/Update stock item
stock.post(
  '/',
  requirePermission('stock', 'write'),
  validateBody(stockItemSchema),
  asyncHandler(async (c) => {
    const item = c.get('validatedBody');
    const user = c.get('user');

    // TODO: Save to Apps Script /sheets
    const newItem = {
      id: `stock_${Date.now()}`,
      ...item,
      governorate: getVanGovernorate(item.vanCode),
      lastUpdated: new Date().toISOString(),
      updatedBy: user.id,
    };

    // TODO: Invalidate cache and sync to Apps Script

    return c.json({ success: true, data: newItem });
  })
);

// GET /api/stock/transfers - List stock transfers
stock.get(
  '/transfers',
  validateQuery(z.object({
    fromVanCode: z.string().optional(),
    toVanCode: z.string().optional(),
    status: z.enum(['pending', 'approved', 'rejected', 'completed']).optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    page: z.coerce.number().default(1),
    pageSize: z.coerce.number().default(50),
  })),
  requirePermission('stock', 'read'),
  asyncHandler(async (c) => {
    const { fromVanCode, toVanCode, status, dateFrom, dateTo, page, pageSize } = c.get('validatedQuery');

    const mockData = generateMockTransfers();

    let filtered = mockData;
    if (fromVanCode) filtered = filtered.filter(d => d.fromVanCode === fromVanCode);
    if (toVanCode) filtered = filtered.filter(d => d.toVanCode === toVanCode);
    if (status) filtered = filtered.filter(d => d.status === status);
    if (dateFrom) filtered = filtered.filter(d => d.requestedAt >= dateFrom);
    if (dateTo) filtered = filtered.filter(d => d.requestedAt <= dateTo);

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

// POST /api/stock/transfers - Create stock transfer request
stock.post(
  '/transfers',
  requirePermission('stock', 'write'),
  validateBody(transferSchema),
  asyncHandler(async (c) => {
    const transfer = c.get('validatedBody');
    const user = c.get('user');

    // TODO: Validate stock availability at fromVanCode
    // TODO: Save to Apps Script /sheets

    const newTransfer = {
      id: `transfer_${Date.now()}`,
      ...transfer,
      status: 'pending' as const,
      requestedAt: new Date().toISOString(),
      requestedBy: user.id,
    };

    return c.json({ success: true, data: newTransfer });
  })
);

// POST /api/stock/transfers/:id/approve - Approve transfer
stock.post(
  '/transfers/:id/approve',
  requirePermission('stock', 'write'),
  asyncHandler(async (c) => {
    const id = c.req.param('id');
    const user = c.get('user');

    // TODO: Update status in Apps Script
    // TODO: Deduct from source van, add to destination van

    return c.json({
      success: true,
      data: {
        id,
        status: 'approved',
        approvedAt: new Date().toISOString(),
        approvedBy: user.id,
      },
    });
  })
);

// POST /api/stock/transfers/:id/reject - Reject transfer
stock.post(
  '/transfers/:id/reject',
  requirePermission('stock', 'write'),
  asyncHandler(async (c) => {
    const id = c.req.param('id');
    const user = c.get('user');
    const { notes } = await c.req.json();

    return c.json({
      success: true,
      data: {
        id,
        status: 'rejected',
        rejectedAt: new Date().toISOString(),
        rejectedBy: user.id,
        notes,
      },
    });
  })
);

// GET /api/stock/alerts - Get low stock alerts
stock.get(
  '/alerts',
  requirePermission('stock', 'read'),
  asyncHandler(async (c) => {
    const mockData = generateMockStockData();
    const lowStock = mockData.filter(d => d.quantity <= d.minQuantity);

    return c.json({
      success: true,
      data: lowStock,
      meta: { total: lowStock.length },
    });
  })
);

// GET /api/stock/summary - Stock summary by van/category
stock.get(
  '/summary',
  validateQuery(z.object({
    vanCode: z.string().optional(),
    governorate: z.string().optional(),
  })),
  requirePermission('stock', 'read'),
  asyncHandler(async (c) => {
    const { vanCode, governorate } = c.get('validatedQuery');

    const mockData = generateMockStockData();
    let filtered = mockData;
    if (vanCode) filtered = filtered.filter(d => d.vanCode === vanCode);
    if (governorate) filtered = filtered.filter(d => d.governorate === governorate);

    const summary = {
      totalItems: filtered.length,
      totalValue: filtered.reduce((s, d) => s + d.quantity * (d.unitPrice || 0), 0),
      lowStockCount: filtered.filter(d => d.quantity <= d.minQuantity).length,
      outOfStockCount: filtered.filter(d => d.quantity === 0).length,
      byCategory: filtered.reduce((acc, d) => {
        if (!acc[d.category]) acc[d.category] = { count: 0, quantity: 0, value: 0 };
        acc[d.category].count++;
        acc[d.category].quantity += d.quantity;
        acc[d.category].value += d.quantity * (d.unitPrice || 0);
        return acc;
      }, {} as Record<string, any>),
      byVan: filtered.reduce((acc, d) => {
        if (!acc[d.vanCode]) acc[d.vanCode] = { count: 0, quantity: 0, value: 0 };
        acc[d.vanCode].count++;
        acc[d.vanCode].quantity += d.quantity;
        acc[d.vanCode].value += d.quantity * (d.unitPrice || 0);
        return acc;
      }, {} as Record<string, any>),
    };

    return c.json({ success: true, data: summary });
  })
);

// Helper functions
function generateMockStockData() {
  const data = [];
  const vans = ['231', '582', '825', '832', '2348', '2349', '2347', '2346', '2357', '1896'];
  const categories = [
    { name: 'WE Air', products: ['WE Air 4G', 'WE Air 5G'], unitPrice: 1200 },
    { name: 'ONT', products: ['ONT GPON', 'ONT XGSPON'], unitPrice: 800 },
    { name: 'CPE', products: ['CPE Indoor', 'CPE Outdoor'], unitPrice: 600 },
    { name: 'Mi-Fi', products: ['Mi-Fi 4G', 'Mi-Fi 5G'], unitPrice: 500 },
    { name: 'Sim Cards', products: ['Physical SIM', 'eSIM'], unitPrice: 50 },
    { name: 'Routers', products: ['Huawei Router', 'Zyxel Router', 'TP-Link Router'], unitPrice: 400 },
  ];

  for (const vanCode of vans) {
    for (const cat of categories) {
      for (const product of cat.products) {
        const quantity = Math.floor(Math.random() * 50);
        const minQuantity = Math.floor(Math.random() * 10) + 5;

        data.push({
          id: `stock_${vanCode}_${cat.name}_${product}`,
          vanCode,
          governorate: getVanGovernorate(vanCode),
          category: cat.name,
          product,
          quantity,
          minQuantity,
          unit: 'قطعة',
          unitPrice: cat.unitPrice,
          lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedBy: 'system',
        });
      }
    }
  }

  return data;
}

function generateMockTransfers() {
  const data = [];
  const vans = ['231', '582', '825', '832', '2348', '2349'];
  const statuses = ['pending', 'approved', 'rejected', 'completed'] as const;
  const products = ['WE Air 4G', 'ONT GPON', 'CPE Indoor', 'Mi-Fi 4G', 'Physical SIM'];

  for (let i = 0; i < 50; i++) {
    const fromVan = vans[Math.floor(Math.random() * vans.length)];
    let toVan = vans[Math.floor(Math.random() * vans.length)];
    while (toVan === fromVan) {
      toVan = vans[Math.floor(Math.random() * vans.length)];
    }

    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const requestedAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);

    data.push({
      id: `transfer_${i}`,
      fromVanCode: fromVan,
      toVanCode: toVan,
      items: [
        { product: products[Math.floor(Math.random() * products.length)], quantity: Math.floor(Math.random() * 20) + 1 },
        { product: products[Math.floor(Math.random() * products.length)], quantity: Math.floor(Math.random() * 15) + 1 },
      ],
      status,
      requestedAt: requestedAt.toISOString(),
      approvedAt: status !== 'pending' ? new Date(requestedAt.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      requestedBy: `user_${Math.floor(Math.random() * 100)}`,
      approvedBy: status !== 'pending' ? `supervisor_${Math.floor(Math.random() * 10)}` : undefined,
      notes: status === 'rejected' ? 'مخزون غير كافٍ' : undefined,
    });
  }

  return data;
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

export default stock;