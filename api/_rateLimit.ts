/**
 * Simple in-memory rate limiter for serverless API routes.
 * Tracks requests per IP with a sliding window.
 *
 * Note: In-memory state resets on cold starts, which is acceptable
 * for serverless — it prevents sustained abuse, not single bursts.
 */

const store = new Map<string, number[]>();

const WINDOW_MS = 60_000; // 1 minute window
const MAX_REQUESTS: Record<string, number> = {
  '/api/scan': 10,      // 10 scans/min (image analysis is expensive)
  '/api/assistant': 20,  // 20 queries/min
  '/api/stores': 15,     // 15 store lookups/min
  '/api/styling': 20,    // 20 styling requests/min
};
const DEFAULT_MAX = 30;

export function rateLimit(
  ip: string,
  endpoint: string
): { allowed: boolean; remaining: number; resetMs: number } {
  const key = `${ip}:${endpoint}`;
  const now = Date.now();
  const max = MAX_REQUESTS[endpoint] ?? DEFAULT_MAX;

  // Get existing timestamps, filter to current window
  const timestamps = (store.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= max) {
    const oldest = timestamps[0];
    return { allowed: false, remaining: 0, resetMs: WINDOW_MS - (now - oldest) };
  }

  timestamps.push(now);
  store.set(key, timestamps);

  // Prevent memory leak: prune stale keys every 100 writes
  if (store.size > 1000) {
    for (const [k, v] of store) {
      if (v.every((t) => now - t >= WINDOW_MS)) store.delete(k);
    }
  }

  return { allowed: true, remaining: max - timestamps.length, resetMs: WINDOW_MS };
}

/** Extract client IP from Vercel request headers */
export function getClientIp(req: { headers: Record<string, string | string[] | undefined> }): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  if (Array.isArray(forwarded)) return forwarded[0];
  return 'unknown';
}
