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

// Set dashboard as a protected route that will redirect to login if not authenticated
export const config = { matcher: ['/dashboard/:path*', '/create', '/api/:path*'] };

// Set rate limit for the dashboard route
export default async function middleware(req) {

}
