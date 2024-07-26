import dbConnect from "@/utils/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import UserData from "@/utils/dbModels/UserData";
import { NextResponse } from "next/server";

// import UserAccount from "@/utils/dbModels/UserAccount";

export async function GET(req, res) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    await dbConnect();

    const userData = await UserData.findOne({ UserId: session.user.id });

    if (!userData) {
        return NextResponse.json(null, { status: 200 });
    }

    const responseUserData = {
        Username: userData.Username,
        JobTitle: userData.JobTitle,
        Level: userData.Level,
        Experience: userData.Experience,
        Stats: userData.Stats,
        HabitList: userData.HabitList,
    };
    return NextResponse.json(responseUserData, { status: 200 });
}