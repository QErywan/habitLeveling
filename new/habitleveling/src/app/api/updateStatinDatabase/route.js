import dbConnect from "@/utils/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import UserData from "@/utils/dbModels/UserData";
import { NextResponse } from "next/server";

import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(10, "10 s"),
});

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
    
        if (!session) {
            return res.status(401).json({ error: "Unauthorized" });
        }
    
        const { stat, value } = body;
    
        await dbConnect();
    
        const userData = await UserData.findOne({ UserId: session.user.id });
        const currPoints = userData.Points;
    
        if (!userData) {
            return NextResponse.json(null, { status: 200 });
        }
    
        await UserData.findOneAndUpdate(
            { UserId: session.user.id },
            { $set: { 
                [`Stats.0.${stat}`]: value,
                Points: currPoints - 1
                }
            }
    
        );
    
        return NextResponse.json("Stats updated", { status: 200 });
    }
}