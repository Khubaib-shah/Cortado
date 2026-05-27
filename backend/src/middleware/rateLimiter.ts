import { Request, Response, NextFunction } from 'express';

// Simple in-memory rate limiter
// Note: For multi-instance/serverless deployments, use Redis-backed solution
interface RateLimitRecord {
  count: number;
  windowStart: number;
}

function createRateLimiter(windowMs: number, maxRequests: number) {
  const records: Record<string, RateLimitRecord> = {};

  return (req: Request, res: Response, next: NextFunction) => {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
      req.ip ||
      'unknown';
    const now = Date.now();

    if (!records[ip] || now - records[ip].windowStart > windowMs) {
      records[ip] = { count: 1, windowStart: now };
      return next();
    }

    records[ip].count += 1;
    if (records[ip].count > maxRequests) {
      return res.status(429).json({
        error: 'Too many requests. Please try again later.',
      });
    }
    next();
  };
}

// Strict limiter for auth endpoints (5 req / min)
export const authRateLimiter = createRateLimiter(60_000, 5);

// Moderate limiter for order tracking (20 req / min) — prevents brute-force of ORD-IDs
export const trackRateLimiter = createRateLimiter(60_000, 20);

// General API limiter (100 req / min)
export const generalRateLimiter = createRateLimiter(60_000, 100);
