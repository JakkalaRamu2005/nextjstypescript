import { NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";


export async function POST(req: Request) {

    await connectDB();

    const { token, newPassword } = await req.json();

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

        const user = await User.findById(decoded.id);

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        user.password = newPassword;
        await user.save();
        return NextResponse.json({ message: "Password updated" });

    }catch(error){
        return NextResponse.json({message: "Invalid token or expires"}, {status: 400});
    }

}