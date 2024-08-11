import dbConnect from "@/utils/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import UserData from "@/utils/dbModels/UserData";
import UserAccount from "@/utils/dbModels/UserAccount";
import { NextResponse } from "next/server";
import { resetHabitsIfNeeded } from "@/utils/resetHabit";
import { levelUpIfNeeded } from "@/utils/levelUp";
import { checkFreeTrial } from "@/utils/checkFreeTrial";

import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(10, "10 s"),
});


export async function GET(req, res) {

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
    } else {
        const session = await getServerSession(authOptions);
        if (!session) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        await dbConnect();

        await levelUpIfNeeded(session.user.id);
        await checkFreeTrial(session.user.id);

        const userData = await UserData.findOne({ UserId: session.user.id });
        
        
        if (!userData) {
            return NextResponse.json(null, { status: 200 });
        }
        // check if user account has access

        const userAccount = await UserAccount.findOne({ _id: session.user.id });

        const responseUserData = {
            Username: userData.Username,
            JobTitle: userData.JobTitle,
            Level: userData.Level,
            Experience: userData.Experience,
            Points: userData.Points,
            Stats: userData.Stats,
            HabitList: await resetHabitsIfNeeded(session.user.id),
            hasAccess: userAccount.hasAccess,
            freeTrial: userAccount.freeTrial,
        };

        return NextResponse.json(responseUserData, { status: 200 });
    }
}