// WE Mobile Units - Rate Limit Middleware
import { Context, Next } from 'hono';
import { rateLimiter } from 'hono-rate-limiter';

type Bindings = {
  CACHE: KVNamespace;
};

// Different rate limits for different endpoint types
export const rateLimitMiddleware = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  limit: 100, // 100 requests per minute
  standardHeaders: 'draft-7',
  keyGenerator: (c: Context) => {
    const authHeader = c.req.header('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      // Use user ID from token if available
      return `user:${authHeader.slice(7, 20)}`;
    }
    // Fallback to IP
    return `ip:${c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown'}`;
  },
  handler: (c: Context) => c.json({ success: false, error: 'Too many requests, please try again later' }, 429),
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
});

// Stricter rate limit for auth endpoints
export const authRateLimitMiddleware = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, // 5 attempts per 15 minutes
  standardHeaders: 'draft-7',
  keyGenerator: (c: Context) => `auth:${c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown'}`,
  handler: (c: Context) => c.json({ success: false, error: 'Too many login attempts, please try again later' }, 429),
});

// Stricter rate limit for write operations
export const writeRateLimitMiddleware = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  limit: 30, // 30 writes per minute
  standardHeaders: 'draft-7',
  keyGenerator: (c: Context) => {
    const authHeader = c.req.header('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      return `write:user:${authHeader.slice(7, 20)}`;
    }
    return `write:ip:${c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown'}`;
  },
  handler: (c: Context) => c.json({ success: false, error: 'Too many write requests, please slow down' }, 429),
});

// Custom rate limiter using KV for distributed rate limiting
export async function customRateLimit(
  c: Context<{ Bindings: Bindings }>,
  next: Next,
  options: {
    key: string;
    limit: number;
    windowMs: number;
  }
) {
  const { key, limit, windowMs } = options;
  const cacheKey = `ratelimit:${key}`;
  const now = Date.now();
  const windowStart = now - windowMs;

  // Get current count from KV
  const data = await c.env.CACHE.get(cacheKey, 'json') as { count: number; resetTime: number } | null;

  if (data && data.resetTime > now) {
    if (data.count >= limit) {
      const retryAfter = Math.ceil((data.resetTime - now) / 1000);
      return c.json(
        { success: false, error: 'Rate limit exceeded', retryAfter },
        429,
        { 'Retry-After': String(retryAfter) }
      );
    }
    // Increment count
    await c.env.CACHE.put(cacheKey, JSON.stringify({ count: data.count + 1, resetTime: data.resetTime }), {
      expirationTtl: Math.ceil(windowMs / 1000) + 1,
    });
  } else {
    // First request in window
    await c.env.CACHE.put(cacheKey, JSON.stringify({ count: 1, resetTime: now + windowMs }), {
      expirationTtl: Math.ceil(windowMs / 1000) + 1,
    });
  }

  await next();
}