import bcrypt from 'bcryptjs';
import dbConnect from '@/utils/mongodb';
import UserAccount from '@/utils/dbModels/UserAccount';
import UserLoginData from '@/utils/dbModels/UserLoginData';
import { NextResponse } from 'next/server';

export async function POST(req, res) {

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
        return NextResponse.json("Missing email or password", { status: 400 });
    }

    await dbConnect();

    try {
        const existingUser = await UserLoginData.findOne({ EmailAddress: email });
        if (existingUser) {
            return NextResponse.json("User already exists", { status: 400 });
        }
        console.log('passed1')

        const userAccount = new UserAccount({ FirstName: 'Test', LastName:'Test'});
        await userAccount.save();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userLoginData = new UserLoginData({
            UserId: userAccount._id,
            PasswordHash: hashedPassword,
            PasswordSalt: salt,
            EmailAddress: email,
        });

        await userLoginData.save();

        return NextResponse.json("User created", { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json("Error registering user", { status: 500 });
    }
}