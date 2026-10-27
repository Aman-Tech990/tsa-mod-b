import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(_req, { params }) {
    const { id } = await params;
    try {
        const deletedCoupon = await prisma.coupon.delete({
            where: {
                id: Number(id)
             }
        });

        return NextResponse.json({
            success: true,
            message: "Coupon deleted successfully!",
            deletedCoupon: deletedCoupon
        }, { status: 200 });
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error!"
        }, { status: 500 });
    }
}