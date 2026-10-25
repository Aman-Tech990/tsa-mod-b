import { prisma } from "@/lib/prisma";
import { isAllowed } from "@/middlewares/isAllowed";
import { isAuth } from "@/middlewares/isAuth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await isAuth();

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Unauthenticated!" },
                { status: 401 }
            );
        }

        if (!isAllowed(user, "Admin")) {
            return NextResponse.json(
                { success: false, message: "Admin Only!" },
                { status: 403 }
            );
        }

        const recent = await prisma.order.findMany({
            orderBy: {
                createdAt: "desc"
            },
            take: 5
        });

        return NextResponse.json({
            success: true,
            message: "Fetched 5 recent orders",
            orders: recent
        }, { status: 200 });

    } catch (error) {
        console.log(error.message);
        return NextResponse.json(
            { success: false, message: "Internal Server Error!" },
            { status: 500 }
        );
    }
}