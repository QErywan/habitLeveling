import dbConnect from "@/utils/mongodb";
import UserData from "@/utils/dbModels/UserData";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { addHabitExperience } from "@/utils/addHabitExperience";
import { removeHabitExperience } from "@/utils/removeHabitExperience";

import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(50, "60 s"),
});



export async function POST(req, res) {

    const ip = req.ip || req.headers.get('x-forwarded-for') || '127.0.0.1';
    const endpoint = req.url;
    const key = `${ip}:${endpoint}`;

    const { limit, reset, remaining } = await ratelimit.limit(key);
    console.log({ limit, reset, remaining });

    if (remaining <= 0) {
        return NextResponse.json({ error: 'Rate limit exceeded' }, {
            status: 429,
            headers: {
                'X-RateLimit-Limit': limit.toString(),
                'X-RateLimit-Remaining': remaining.toString(),
                'X-RateLimit-Reset': reset.toString(),
            },
        });
    }

    const session = await getServerSession(authOptions);
    const body = await req.json();

    const { habitId, status } = body;

    if (!habitId) {
        return NextResponse.json("Missing habit id", { status: 400 });
    }

    await dbConnect();

    try {

        await UserData.findOneAndUpdate(
            { UserId: session.user.id },
            { $pull: { HabitList: { _id: habitId } } }
        );

        return NextResponse.json("Habit deleted", { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json("Error deleting habit", { status: 500 });
    }
}