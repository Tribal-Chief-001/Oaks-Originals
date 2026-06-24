import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory sliding window rate limiter
// Key: IP, Value: Array of timestamps
const ipRequestLog = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 60; // 60 requests per minute

export function middleware(request: NextRequest) {
  // Only rate-limit API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const ip = request.ip || request.headers.get("x-forwarded-for") || "anonymous";
    const now = Date.now();

    let timestamps = ipRequestLog.get(ip) || [];
    // Filter out timestamps older than 1 minute
    timestamps = timestamps.filter(time => now - time < RATE_LIMIT_WINDOW);

    if (timestamps.length >= MAX_REQUESTS) {
      console.warn(`[Rate Limiter] Blocked IP: ${ip} (exceeded ${MAX_REQUESTS} req/min)`);
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

    // Add current timestamp and save
    timestamps.push(now);
    ipRequestLog.set(ip, timestamps);
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
