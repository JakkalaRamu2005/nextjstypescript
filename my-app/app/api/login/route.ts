import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken"


export async function POST(request: Request) {
    try {
        await connectDB();

        const { email, password } = await request.json();

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }


        if (user.password !== password) {
            return NextResponse.json({ message: "Wrong password" }, { status: 400 });
        }

        const token = jwt.sign({id: user._id, email: user.email}, process.env.JWT_SECRET!, {expiresIn: "7d"})



        const response = NextResponse.json({message: "Login successful", user}, {status: 200})

        response.cookies.set("token", token,{
            httpOnly: false,
            secure: true,
            sameSite:"strict",
            maxAge: 7*24*60*60,
            path:"/",

        })

        return response;
    } catch (error) {
        return NextResponse.json({ message: "server error", error }, { status: 500 });
    }
}