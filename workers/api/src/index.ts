// WE Mobile Units - Cloudflare Worker API Entry Point
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import { rateLimiter } from 'hono-rate-limiter';

import authRoutes from './routes/auth';
import sheetsRoutes from './routes/sheets';
import dataRoutes from './routes/data';
import reconciliationRoutes from './routes/reconciliation';
import financeRoutes from './routes/finance';
import reportsRoutes from './routes/reports';
import stockRoutes from './routes/stock';
import leavesRoutes from './routes/leaves';
import whatsappRoutes from './routes/whatsapp';
import dawryRoutes from './routes/dawry';

import { authMiddleware } from './middleware/auth';
import { rateLimitMiddleware } from './middleware/rateLimit';
import { errorHandler } from './middleware/errorHandler';

type Bindings = {
  CACHE: KVNamespace;
  DB: D1Database;
  CAIRO_SCRIPT_URL: string;
  DELTA_SCRIPT_URL: string;
  UPPER_SCRIPT_URL: string;
  REPORTS_SCRIPT_URL: string;
  INTERNAL_SECRET: string;
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

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Global middleware
app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', secureHeaders());
app.use('*', cors({
  origin: ['https://we-review.pages.dev', 'https://we-emp.pages.dev', 'https://we-inv.pages.dev', 'https://we-shell.pages.dev', 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Internal-Secret'],
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
  maxAge: 86400,
}));

// Rate limiting
app.use('/api/*', rateLimitMiddleware);

// Health check
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

// API routes
const api = app.basePath('/api');

// Public routes (no auth required)
api.route('/auth', authRoutes);

// Protected routes (auth required)
api.use('/data/*', authMiddleware);
api.use('/reconciliation/*', authMiddleware);
api.use('/finance/*', authMiddleware);
api.use('/reports/*', authMiddleware);
api.use('/stock/*', authMiddleware);
api.use('/leaves/*', authMiddleware);
api.use('/whatsapp/*', authMiddleware);
api.use('/dawry/*', authMiddleware);

// Internal routes (require X-Internal-Secret header)
api.use('/sheets/*', async (c, next) => {
  const secret = c.req.header('X-Internal-Secret');
  if (secret !== c.env.INTERNAL_SECRET) {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }
  await next();
});

api.route('/auth', authRoutes);
api.route('/data', dataRoutes);
api.route('/reconciliation', reconciliationRoutes);
api.route('/finance', financeRoutes);
api.route('/reports', reportsRoutes);
api.route('/stock', stockRoutes);
api.route('/leaves', leavesRoutes);
api.route('/whatsapp', whatsappRoutes);
api.route('/dawry', dawryRoutes);
api.route('/sheets', sheetsRoutes);

// 404 handler
app.notFound((c) => c.json({ success: false, error: 'Not found' }, 404));

// Error handler
app.onError(errorHandler);

export default app;
export type { Bindings, Variables };