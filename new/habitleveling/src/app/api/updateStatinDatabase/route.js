import dbConnect from "@/utils/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import UserData from "@/utils/dbModels/UserData";
import { NextResponse } from "next/server";

export async function POST(req, res) {
    
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