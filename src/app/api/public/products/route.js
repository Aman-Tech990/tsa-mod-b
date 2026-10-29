import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);

        const search = searchParams.get("search") || "";
        const category = searchParams.get("categoty") || "";
        const page = searchParams.get("page") || 1;

        if (!Number.isInteger(Number(page)) || page < 1) {
            return NextResponse.json({
                success: true,
                message: "Invalid Page"
            }, { status: 400 });
        }

        if (category) {
            const valid = await prisma.category.findUnique({
                id: category
            });

            if (!valid) {
                return NextResponse.json({
                    success: true,
                    message: "Invalid Category"
                }, { status: 400 });
            }
        }

        const limit = 12;
        const where = {
            status: "Active",
            name: {
                contains: search,
                mode: "insensitive"
            },
            ...(category && {
                categoryId: Number(category)
            })
        }

        const products = await prisma.product.findMany({
            where,
            include: {
                category: true
            },
            orderBy: {
                createdAt: "desc"
            },
            skip: (page - 1) * limit,
            take: limit
        });

        const totalProducts = await prisma.product.count({
            where
        });

        return NextResponse.json({
            success: true,
            products,
            totalProducts: totalProducts,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit)
        }, { status: 200 });

    } catch (error) {
        console.log(error.message);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error!"
        }, { status: 500 });
    }
}