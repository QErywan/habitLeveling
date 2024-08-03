import dbConnect from "@/utils/mongodb";
import UserData from "@/utils/dbModels/UserData";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";

import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(10, "10 s"),
});

export const config = {
    runtime: 'edge',
}

export async function POST(req, res) {
    const ip = req.ip || req.headers.get('x-forwarded-for') || '127.0.0.1';
    const endpoint = req.url;
    const key = `${ip}:${endpoint}`;

    const { limit, reset, remaining } = await ratelimit.limit(key);

    if (remaining <= 0) {
        return NextResponse.json({ error: 'Rate limit exceeded' }, {
            status: 429,
            headers: {
                'X-RateLimit-Limit': limit.toString(),
                'X-RateLimit-Remaining': remaining.toString(),
                'X-RateLimit-Reset': reset.toString(),
            },
        });
    } else {
        const session = await getServerSession(authOptions);
        const body = await req.json();
    
        const { habit } = body;
    
        if (!habit) {
            return NextResponse.json("Missing habit name", { status: 400 });
        }
    
        await dbConnect();
    
        try {
            await UserData.findOneAndUpdate(
                { UserId: session.user.id },
                { $push: { HabitList: { Name: habit } } }
            );
    
            return NextResponse.json("Habit created", { status: 200 });
        } catch (error) {
            console.log(error);
            return NextResponse.json("Error creating habit", { status: 500 });
        }
    }
}