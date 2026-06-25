import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// Local thread-safe in-memory sliding window rate limiter fallback
const ipRequestLog = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 60; // 60 requests per minute

async function checkRateLimit(ip: string): Promise<{ success: boolean; count: number }> {
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    try {
      const key = `ratelimit:${ip}`;
      // Send INCR and TTL in a single round-trip pipeline
      const response = await fetch(`${UPSTASH_URL}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${UPSTASH_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ["INCR", key],
          ["TTL", key]
        ]),
        signal: AbortSignal.timeout(1500)
      });

      if (response.ok) {
        const results = await response.json();
        const incrResult = results[0]?.result;
        const ttlResult = results[1]?.result;

        if (typeof incrResult === "number") {
          // If it's a new request window or TTL is missing, set a 60s expiration
          if (incrResult === 1 || ttlResult === -1) {
            await fetch(`${UPSTASH_URL}/expire/${key}/60`, {
              headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
              signal: AbortSignal.timeout(1000)
            });
          }
          return {
            success: incrResult <= MAX_REQUESTS,
            count: incrResult
          };
        }
      }
    } catch (e) {
      console.warn("[Rate Limiter] Upstash Redis rate limit failed, using local in-memory fallback: ", e);
    }
  }

  // Local sliding window fallback logic
  const now = Date.now();
  let timestamps = ipRequestLog.get(ip) || [];
  timestamps = timestamps.filter(time => now - time < RATE_LIMIT_WINDOW);

  if (timestamps.length >= MAX_REQUESTS) {
    return { success: false, count: timestamps.length };
  }

  timestamps.push(now);
  ipRequestLog.set(ip, timestamps);
  return { success: true, count: timestamps.length };
}

export async function middleware(request: NextRequest) {
  // Only rate-limit API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const ip = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for") || "anonymous";
    
    const limit = await checkRateLimit(ip);
    if (!limit.success) {
      console.warn(`[Rate Limiter] Blocked IP: ${ip} (exceeded ${MAX_REQUESTS} req/min, current: ${limit.count})`);
      return NextResponse.json(
        { error: "Too many requests. Please slow down, Trainer!" },
        { 
          status: 429,
          headers: {
            "Retry-After": "60",
            "Content-Type": "application/json"
          }
        }
      );
    }
  }

  // Proceed with request, injecting security headers
  const response = NextResponse.next();
  
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  return response;
}

// Target API paths and ignore static routes
export const config = {
  matcher: "/api/:path*",
};
