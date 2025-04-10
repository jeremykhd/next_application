import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit } from "./rate-limit";

// Security headers middleware
export function securityHeaders(req: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `;

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set(
    "Content-Security-Policy",
    cspHeader.replace(/\s{2,}/g, " ").trim()
  );
  requestHeaders.set("X-Frame-Options", "DENY");
  requestHeaders.set("X-Content-Type-Options", "nosniff");
  requestHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");
  requestHeaders.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return requestHeaders;
}

// Rate limiting middleware
export async function rateLimitMiddleware(req: NextRequest) {
  const ip = req.ip ?? "127.0.0.1";
  const { success, limit, reset, remaining } = await rateLimit.limit(ip);

  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Limit", limit.toString());
  response.headers.set("X-RateLimit-Remaining", remaining.toString());
  response.headers.set("X-RateLimit-Reset", reset.toString());

  if (!success) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: {
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toString(),
      },
    });
  }

  return response;
}

// Combined middleware
export async function middleware(req: NextRequest) {
  const securityHeadersResponse = securityHeaders(req);
  const rateLimitResponse = await rateLimitMiddleware(req);

  if (rateLimitResponse.status === 429) {
    return rateLimitResponse;
  }

  const response = NextResponse.next({
    request: {
      headers: securityHeadersResponse,
    },
  });

  return response;
}
