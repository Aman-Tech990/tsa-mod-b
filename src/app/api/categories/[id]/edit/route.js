import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {

    const { id } = await params;

    try {
        const { name } = await req.json();
 
        if (!name || name === undefined) {
            return NextResponse.json({
                success: false,
                message: "Name is required!"
            }, { status: 400 });
        }

        const updatedCategory = await prisma.category.update({
            where: {
                id: Number(id)
            }, data: {
                name
            }
        });

        return NextResponse.json({
            success: true,
            message: "Updated category!",
            updatedCategory: updatedCategory
        }, { status: 200 });

    } catch (error) {
        console.log(error.message);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error!"
        }, { status: 500 });
    }
}