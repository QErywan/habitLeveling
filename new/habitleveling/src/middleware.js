import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

export const auth = withAuth({
    secret: process.env.SECRET,
});

const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(5, '10 s'),
});

// set dashboard as a protected route that will redicrect to login if not authenticated
export const config = { matcher: ['/dashboard/:path', '/create', '/api/:path'] };

// set rate limit for the dashboard route
export default async function middleware(req) {
    const ip = req.ip || req.headers.get('x-forwarded-for') || '127.0.0.1';
    const { success, pending, limit, reset, remaining } = await ratelimit.limit(ip);
    console.log({ success, pending, limit, reset, remaining });

    return success 
        ? NextResponse.next()
        : NextResponse.error('Rate limit exceeded', { status: 429 });
}
