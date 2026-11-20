// WE Mobile Units - Error Handler Middleware
import { Context, Env, HTTPException } from 'hono';

type Bindings = {
  CACHE: KVNamespace;
};

export function errorHandler(err: Error, c: Context<{ Bindings: Bindings }>) {
  // Log error
  console.error(`[ERROR] ${new Date().toISOString()} - ${c.req.method} ${c.req.url}`, {
    error: err.message,
    stack: err.stack,
    path: c.req.path,
    method: c.req.method,
  });

  // Handle HTTPException (intentional HTTP errors)
  if (err instanceof HTTPException) {
    return c.json(
      { success: false, error: err.message, code: err.status.toString() },
      err.status
    );
  }

  // Handle validation errors
  if (err.name === 'ZodError' || err.message.includes('validation')) {
    return c.json(
      { success: false, error: 'Validation failed', details: err.message },
      400
    );
  }

  // Handle JWT errors
  if (err.name === 'JWTExpired' || err.name === 'JWSSignatureVerificationFailed') {
    return c.json(
      { success: false, error: 'Authentication failed', code: 'AUTH_ERROR' },
      401
    );
  }

  // Handle fetch/network errors
  if (err instanceof TypeError && err.message.includes('fetch')) {
    return c.json(
      { success: false, error: 'External service unavailable', code: 'SERVICE_UNAVAILABLE' },
      503
    );
  }

  // Handle D1/KV errors
  if (err.message.includes('D1') || err.message.includes('KV') || err.message.includes('database')) {
    return c.json(
      { success: false, error: 'Database error', code: 'DB_ERROR' },
      500
    );
  }

  // Default: internal server error
  const isDev = c.env.ENVIRONMENT === 'development';

  return c.json(
    {
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      ...(isDev && { details: err.message, stack: err.stack }),
    },
    500
  );
}

// Async error wrapper for route handlers
export function asyncHandler(
  handler: (c: Context<{ Bindings: Bindings }>) => Promise<Response>
) {
  return async (c: Context<{ Bindings: Bindings }>) => {
    try {
      return await handler(c);
    } catch (err) {
      return errorHandler(err as Error, c);
    }
  };
}

// Validation helper
export function validateBody<T>(schema: { parse: (data: any) => T }) {
  return async (c: Context<{ Bindings: Bindings }>, next: () => Promise<void>) => {
    try {
      const body = await c.req.json();
      const validated = schema.parse(body);
      c.set('validatedBody', validated);
      await next();
    } catch (err) {
      throw new HTTPException(400, { message: 'Invalid request body', cause: err });
    }
  };
}

// Query validation helper
export function validateQuery<T>(schema: { parse: (data: any) => T }) {
  return async (c: Context<{ Bindings: Bindings }>, next: () => Promise<void>) => {
    try {
      const query = Object.fromEntries(new URL(c.req.url).searchParams);
      const validated = schema.parse(query);
      c.set('validatedQuery', validated);
      await next();
    } catch (err) {
      throw new HTTPException(400, { message: 'Invalid query parameters', cause: err });
    }
  };
}