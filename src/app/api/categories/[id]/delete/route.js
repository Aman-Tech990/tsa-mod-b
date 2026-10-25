import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(_req, { params }) {

    const { id } = await params;

    try {

        const product = await prisma.product.findFirst({
            where: {
                categoryId: Number(id)
            }
        })

        if (product) {
            return NextResponse.json({
                success: false,
                message: "Cannot delete a category that has products assigned."
            }, { status: 400 });
        }

        const deletedCategory = await prisma.category.delete({
            where: {
                id: Number(id)
            }
        });

        return NextResponse.json({
            success: true,
            message: "Updated category!",
            deletedCategory: deletedCategory
        }, { status: 200 });

    } catch (error) {
        console.log(error.message);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error!"
        }, { status: 500 });
    }
}