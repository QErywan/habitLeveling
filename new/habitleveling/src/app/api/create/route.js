import dbConnect from "@/utils/mongodb";
import UserAccount from "@/utils/dbModels/UserAccount";
import UserData from "@/utils/dbModels/UserData";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";

import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(5, "30 s"),
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
        const body = await req.json();
        const session = await getServerSession(authOptions);
        const { username, userClass } = body;

        if (!username || !userClass) {
            return NextResponse.json("Missing username or class", { status: 400 });
        };  
        // STR: 0, AGI: 0, VIT: 0, INT: 0, FAI: 0, LUK: 0
        let defaultStatus = {
            STR: 0,
            AGI: 0,
            VIT: 0,
            INT: 0,
            FAI: 0,
            LUK: 0,
        };

        switch (userClass) {
            case "warrior":
                defaultStatus = [{
                    STR: 10,
                    AGI: 5,
                    VIT: 10,
                    INT: 0,
                    FAI: 0,
                    LUK: 0,
                }];
                break;
            case "mage":
                defaultStatus = [{
                    STR: 0,
                    AGI: 5,
                    VIT: 5,
                    INT: 10,
                    FAI: 0,
                    LUK: 0,
                }];
                break;
            case "ranger":
                defaultStatus = [{
                    STR: 5,
                    AGI: 10,
                    VIT: 5,
                    INT: 0,
                    FAI: 0,
                    LUK: 0,
                }];
                break;
            case "rogue":
                defaultStatus = [{
                    STR: 0,
                    AGI: 5,
                    VIT: 10,
                    INT: 5,
                    FAI: 0,
                    LUK: 0,
                }];
                break;
            default:
                return NextResponse.json("Invalid class", { status: 400 });
        };

        await dbConnect();

        const existingData = await UserData.findOne({ username });
        if (existingData) {
            return NextResponse.json("User already exists", { status: 500 });
        }

        const userData = new UserData({
            UserId: session.user.id,
            Username: username,
            JobTitle: userClass,
            Level: 1,
            Experience: 0,
            Stats: defaultStatus,
            HabitList: [],

        });

        await userData.save();

        return NextResponse.json("Data created", { status: 200 });

    }

}