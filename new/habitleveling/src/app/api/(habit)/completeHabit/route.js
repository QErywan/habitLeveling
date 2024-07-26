import dbConnect from "@/utils/mongodb";
import UserData from "@/utils/dbModels/UserData";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";


export async function POST(req, res) {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const { habitId, status } = body;

    if (!habitId) {
        return NextResponse.json("Missing habit id", { status: 400 });
    }

    await dbConnect();

    try {
        if (status) {
            await UserData.findOneAndUpdate(
                { UserId: session.user.id, HabitList: { $elemMatch: { _id: habitId } } },
                { $set: { "HabitList.$.Status": true } }
            );

        } else {
            await UserData.findOneAndUpdate(
                { UserId: session.user.id, HabitList: { $elemMatch: { _id: habitId } } },
                { $set: { "HabitList.$.Status": false } }
            );
        }

        return NextResponse.json("Habit completed", { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json("Error completing habit", { status: 500 });
    }
}