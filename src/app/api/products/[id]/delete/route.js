import { prisma } from "@/lib/prisma";
import { isAllowed } from "@/middlewares/isAllowed";
import { isAuth } from "@/middlewares/isAuth";
import { NextResponse } from "next/server";

export async function DELETE(_req, { params }) {
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
                message: "Unauthorized! Admin Only."
            }, { status: 403 });
        }

        const { id } = await params;
        const productId = Number(id);

        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product) {
            return NextResponse.json({
                success: false,
                message: "Product not found!"
            }, { status: 404 });
        }

        const orderItem = await prisma.orderItem.findFirst({
            where: { productId },
            select: {
                id: true
            }
        });

        if (orderItem) {
            return NextResponse.json({
                success: false,
                message: "Cannot delete a product with order history."
            }, { status: 409 });
        }

        const deletedProduct = await prisma.product.delete({
            where: {
                id: productId
            }
        });

        return NextResponse.json({
            success: true,
            message: "Product deleted successfully!",
            deletedProduct: deletedProduct
        }, { status: 200 });

    } catch (error) {
        console.log(error.message);

        if (error.code === "P2003") {
            return NextResponse.json({
                success: false,
                message: "Cannot delete a product with order history!"
            }, { status: 409 });
        }

        return NextResponse.json({
            success: false,
            message: "Internal Server Error!"
        }, { status: 500 });
    }
}