import dbConnect from "@/utils/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import UserData from "@/utils/dbModels/UserData";
import { NextResponse } from "next/server";
import { resetHabitsIfNeeded } from "@/utils/resetHabit";
import { levelUpIfNeeded } from "@/utils/levelUp";

// import UserAccount from "@/utils/dbModels/UserAccount";

export async function GET(req, res) {

    const session = await getServerSession(authOptions);
    if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    await dbConnect();

    await levelUpIfNeeded(session.user.id);

    const userData = await UserData.findOne({ UserId: session.user.id });

    if (!userData) {
        return NextResponse.json(null, { status: 200 });
    }

    await resetHabitsIfNeeded(session.user.id);

    const responseUserData = {
        Username: userData.Username,
        JobTitle: userData.JobTitle,
        Level: userData.Level,
        Experience: userData.Experience,
        Points: userData.Points,
        Stats: userData.Stats,
        HabitList: userData.HabitList,
    };

    return NextResponse.json(responseUserData, { status: 200 });
}