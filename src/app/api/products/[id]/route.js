import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_req, { params }) {
    const { id } = await params;
    try {
        const product = await prisma.product.findUnique({
            where: {
                id: Number(id)
            }, 
            include: {
                category: true
            }
        });

        if (!product) {
            return NextResponse.json({
                success: false,
                message: "Product not found!"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Product fetched!",
            product: product
        }, { status: 200 });

    } catch (error) {
        console.log(error.message);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error!"
        }, { status: 500 });
    }
}