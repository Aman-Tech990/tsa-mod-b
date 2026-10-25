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

        const total = await prisma.order.count();
        return NextResponse.json({
            success: true,
            message: "Total Orders Count fetched!",
            total: total
        }, { status: 200 });

    } catch (error) {
        console.log(error.message);
        return NextResponse.json({
            success: false,
            message: "Internal server error!"
        }, { status: 500 });
    }
}