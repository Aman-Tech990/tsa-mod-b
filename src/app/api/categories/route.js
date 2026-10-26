import { prisma } from "@/lib/prisma";
import { isAllowed } from "@/middlewares/isAllowed";
import { isAuth } from "@/middlewares/isAuth";
import { NextResponse } from "next/server";

export async function GET() {
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

        const categories = await prisma.category.findMany({
            orderBy: {
                id: "asc"
            }
        });

        if (!categories || categories.length === 0) {
            return NextResponse.json({
                success: false,
                message: "No categories found!"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Categories fetched successfully!",
            categories: categories
        }, { status: 200 });

    } catch (error) {
        console.log(error.message);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error!"
        }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const { name } = await req.json();

        if (!name || name === undefined) {
            return NextResponse.json({
                success: false,
                message: "Name is required!"
            }, { status: 400 });
        }

        const exists = await prisma.category.findUnique({
            where: { name }
        });
        if (exists) {
            return NextResponse.json({
                success: false,
                message: "Category name already exists."
            }, { status: 400 });
        }

        const newCategory = await prisma.category.create({
            data: {
                name
            }
        });

        return NextResponse.json({
            success: true,
            message: "New category created!",
            category: newCategory
        }, { status: 201 });

    } catch (error) {
        console.log(error.message);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error!"
        }, { status: 500 });
    }
}