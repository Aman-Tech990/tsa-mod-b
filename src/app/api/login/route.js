import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
    return jwt.sign({ id }, "jwtsecret", { expiresIn: "7d" });
}

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({
                success: false,
                message: "All fields required!"
            }, { status: 404 });
        }

        const exists = await prisma.user.findUnique({
            where: { email }
        });

        if (!exists) {
            return NextResponse.json({
                success: false,
                message: "Invalid email or password!"
            }, { status: 400 });
        }

        const matchedPassword = await bcrypt.compare(password, exists.password);

        if (!matchedPassword) {
            return NextResponse.json({
                success: false,
                message: "Invalid email or password!"
            }, { status: 400 });
        }

        if (exists.role !== "Admin") {
            return NextResponse.json({
                success: false,
                message: "Admin Auth only!",
            }, { status: 400 });
        }

        const token = generateToken(exists.id);

        const response = NextResponse.json({
            success: true,
            message: "Admin loggedin successful!",
            admin: exists
        }, { status: 200 });

        response.cookies.set("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return response;

    } catch (error) {
        console.log(error.message);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error!"
        }, { status: 500 });
    }
}