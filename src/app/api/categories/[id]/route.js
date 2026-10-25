import { prisma } from "@/lib/prisma";
import { isAllowed } from "@/middlewares/isAllowed";
import { isAuth } from "@/middlewares/isAuth";
import { NextResponse } from "next/server";

export async function GET(_req, { params }) {
    const { id } = await params;

    try {

        const user = await isAuth();
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "Unauthenticated!"
            }, { status: 401 });
        }

        const allowed = await isAllowed(user, "Admin");
        if (!allowed) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized!"
            }, { status: 403 });
        }

        const category = await prisma.category.findUnique({
            where: {
                id: Number(id)
            }, include: {
                products: true
            }
        });

        if (!category || category.length === 0) {
            return NextResponse.json({
                success: false,
                message: "No category found!"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Category fetched successfully!",
            category: category
        }, { status: 200 });

    } catch (error) {
        console.log(error.message);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error!"
        }, { status: 500 });
    }
}