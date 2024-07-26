import dbConnect from "@/utils/mongodb";
import UserData from "@/utils/dbModels/UserData";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";


export async function POST(req, res) {
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