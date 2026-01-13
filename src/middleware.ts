// Production-Ready Middleware for Seera AI
// Handles authentication, rate limiting, security headers, and maintenance mode

import NextAuth from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authConfig } from '@/lib/auth.config';

// Initialize NextAuth with the Edge-compatible config
const { auth } = NextAuth(authConfig);

// Routes that require authentication
const protectedRoutes = [
    '/dashboard',
    '/onboarding',
    '/admin',
    '/api/resumes',
    '/api/ai',
    '/api/career',
    '/api/interview',
    '/api/billing',
    '/api/job-targets',
    '/api/applications',
    '/api/linkedin',
    '/api/pitch',
];

// Routes that are only for non-authenticated users
const authRoutes = ['/login', '/register', '/forgot-password'];

// Public API routes (no auth required)
const publicApiRoutes = [
    '/api/auth',
    '/api/webhooks',
    '/api/stripe/webhook',
    '/api/public',
    '/api/health',
];

// Admin-only routes
const adminRoutes = ['/admin'];

// In-memory rate limiting (Edge-compatible fallback)
const rateLimitMap = new Map<string, { count: number; startTime: number }>();

// Clean up old rate limit entries periodically
function cleanupRateLimits() {
    const now = Date.now();
    const windowMs = 60 * 1000;

    const entries = Array.from(rateLimitMap.entries());
    for (const [key, value] of entries) {
        if (now - value.startTime > windowMs * 2) {
            rateLimitMap.delete(key);
        }
    }

    // Prevent memory leak - limit to 50k entries
    if (rateLimitMap.size > 50000) {
        const sortedEntries = entries.sort((a, b) => a[1].startTime - b[1].startTime);
        for (let i = 0; i < 10000; i++) {
            rateLimitMap.delete(sortedEntries[i][0]);
        }
    }
}

// Rate limit check
function checkRateLimit(ip: string, pathname: string): { allowed: boolean; retryAfter: number } {
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute

    // Different limits for different endpoints
    let limit = 100; // Default
    if (pathname.startsWith('/api/auth')) {
        limit = 10; // Strict for auth
    } else if (pathname.startsWith('/api/ai')) {
        limit = 30; // Medium for AI
    } else if (pathname.startsWith('/api/stripe')) {
        limit = 50; // Webhooks
    }

    const key = `${ip}:${pathname.split('/').slice(0, 3).join('/')}`;
    const rateLimit = rateLimitMap.get(key) ?? { count: 0, startTime: now };

    // Reset window if expired
    if (now - rateLimit.startTime > windowMs) {
        rateLimit.count = 0;
        rateLimit.startTime = now;
    }

    rateLimit.count++;
    rateLimitMap.set(key, rateLimit);

    // Periodic cleanup
    if (Math.random() < 0.01) {
        cleanupRateLimits();
    }

    if (rateLimit.count > limit) {
        const retryAfter = Math.ceil((windowMs - (now - rateLimit.startTime)) / 1000);
        return { allowed: false, retryAfter };
    }

    return { allowed: true, retryAfter: 0 };
}

// Security headers
function getSecurityHeaders(): Headers {
    const headers = new Headers();

    // Prevent clickjacking
    headers.set('X-Frame-Options', 'DENY');

    // Prevent MIME type sniffing
    headers.set('X-Content-Type-Options', 'nosniff');

    // Referrer policy
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Permissions policy
    headers.set(
        'Permissions-Policy',
        'camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=(self)'
    );

    // HSTS - force HTTPS
    headers.set(
        'Strict-Transport-Security',
        'max-age=63072000; includeSubDomains; preload'
    );

    // XSS protection (legacy browsers)
    headers.set('X-XSS-Protection', '1; mode=block');

    // DNS prefetch control
    headers.set('X-DNS-Prefetch-Control', 'on');

    return headers;
}

// Create JSON error response
function jsonError(message: string, status: number, headers?: Headers): NextResponse {
    return new NextResponse(
        JSON.stringify({
            error: message,
            status,
            timestamp: new Date().toISOString(),
        }),
        {
            status,
            headers: {
                'Content-Type': 'application/json',
                ...(headers ? Object.fromEntries(headers) : {}),
            },
        }
    );
}

// Export the middleware function
export default auth(async function middleware(req: any) {
    const { pathname } = req.nextUrl;
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        req.headers.get('x-real-ip') ||
        req.ip ||
        '127.0.0.1';

    // Skip middleware for static files
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname.startsWith('/favicon') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // Health check endpoint
    if (pathname === '/api/health') {
        return new NextResponse(
            JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // Maintenance mode check
    if (process.env.MAINTENANCE_MODE === 'true' && !pathname.startsWith('/api/health')) {
        // Allow admins through
        const session = req.auth;
        if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
            if (pathname.startsWith('/api')) {
                return jsonError('Service under maintenance', 503);
            }
            // Redirect to maintenance page for non-API routes
            return NextResponse.redirect(new URL('/maintenance', req.url));
        }
    }

    // Rate limiting
    const rateCheck = checkRateLimit(ip, pathname);
    if (!rateCheck.allowed) {
        const headers = getSecurityHeaders();
        headers.set('Retry-After', String(rateCheck.retryAfter));
        headers.set('X-RateLimit-Limit', '100');
        headers.set('X-RateLimit-Remaining', '0');
        headers.set('X-RateLimit-Reset', String(Date.now() + rateCheck.retryAfter * 1000));

        return jsonError('Too many requests', 429, headers);
    }

    // Get session
    const session = req.auth;
    const isLoggedIn = !!session?.user;
    const userRole = session?.user?.role || 'USER';

    // Check route types
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
    const isPublicApi = publicApiRoutes.some(route => pathname.startsWith(route));
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
    const isApiRoute = pathname.startsWith('/api');

    // Admin route protection
    if (isAdminRoute && isLoggedIn) {
        if (!['ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
            if (isApiRoute) {
                return jsonError('Forbidden', 403);
            }
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }
    }

    // Redirect unauthenticated users from protected routes
    if (isProtectedRoute && !isLoggedIn) {
        if (isApiRoute) {
            return jsonError('Unauthorized', 401);
        }
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Redirect authenticated users from auth routes
    if (isAuthRoute && isLoggedIn) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // API Protection (non-public routes)
    if (isApiRoute && !isPublicApi && !isLoggedIn) {
        return jsonError('Unauthorized', 401);
    }

    // Create response with security headers
    const response = NextResponse.next();
    const securityHeaders = getSecurityHeaders();

    // Apply security headers
    securityHeaders.forEach((value, key) => {
        response.headers.set(key, value);
    });

    // Add request ID for tracing
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    response.headers.set('X-Request-ID', requestId);

    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', '100');
    response.headers.set('X-RateLimit-Remaining', '99');

    return response;
});

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files with extensions
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
    ],
};
