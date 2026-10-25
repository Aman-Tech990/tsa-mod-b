import { prisma } from "@/lib/prisma";
import { isAllowed } from "@/middlewares/isAllowed";
import { isAuth } from "@/middlewares/isAuth";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
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

        const formData = await req.formData();

        const name = formData.get("name");
        const category = formData.get("category");
        const price = formData.get("price");
        const stock = formData.get("stock");
        const status = formData.get("status");
        const description = formData.get("description");

        const obj = {};
        if (name) obj.name = name;
        if (category !== undefined) {
            obj.category = {
                connect: {
                    id: Number(category)
                }
            }
        }
        if (price !== undefined) obj.price = Number(price);
        if (stock !== undefined) obj.stock = Number(stock);
        if (status !== undefined) obj.status = status;
        if (description !== undefined) {
            obj.description = description;
        }

        if (Object.keys(obj).length === 0) {
            return NextResponse.json({
                success: false,
                message: "Atleast one field is required!"
            }, { status: 400 });
        }

        const { id } = await params;
        const productId = Number(id);

        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: obj
        });

        return NextResponse.json({
            success: true,
            message: "Product updated successfully!",
            product: updatedProduct
        }, { status: 200 });

    } catch (error) {
        console.log(error.message);
        if (error.code === "P2025") {
            return NextResponse.json({
                success: false,
                message: "Product not found."
            }, { status: 404 });
        }

        return NextResponse.json({
            success: false,
            message: "Internal Server Error!"
        }, { status: 500 });
    }
}