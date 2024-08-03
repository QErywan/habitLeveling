import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import dbConnect from './utils/mongodb';

export const auth = withAuth({
    secret: process.env.SECRET,
});

const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(1000, '10 s'),
});

// set dashboard as a protected route that will redicrect to login if not authenticated
export const config = { matcher: ['/dashboard/:path*', '/create', '/api/:path*'] };

// set rate limit for the dashboard route
export default async function middleware(req) {
    // const ip = req.ip || req.headers.get('x-forwarded-for') || '127.0.0.1';

    // const { data: session, status } = await auth(req);
    // console.log(session, status);
    // const { success, pending, limit, reset, remaining } = await ratelimit.limit(ip);

    // if (!success) {
    //     return NextResponse.json({ error: 'Rate limit exceeded' }, {
    //         status: 429,
    //     });
    // }

    // if (status === 'authenticated') {
    //     await dbConnect();

    //     const userAccount = await UserAccount.findOne({ _id: session.user.id });
    //     if (!userAccount || !userAccount.hasAccess) {
    //         return NextResponse.redirect('/pricing');
    //     }

    //     return NextResponse.next();

    // } else if (status === 'unauthenticated') {
    //     return NextResponse.redirect('/signin');
    // }

    // return NextResponse.next();
}
