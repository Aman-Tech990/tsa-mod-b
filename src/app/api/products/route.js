import { prisma } from "@/lib/prisma";
import { isAllowed } from "@/middlewares/isAllowed";
import { isAuth } from "@/middlewares/isAuth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const res = await prisma.product.findMany({
            include: {
                category: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json({
            success: true,
            message: "All Products fetched successfully!",
            products: res
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
        const description = formData.get("description");
        const status = formData.get("status");
        const image = formData.get("image");
        
        if (!name?.trim() || category === null || price === null || stock === null || !status) {
            return NextResponse.json({
                success: false,
                message: "Required fields cannot be blank!"
            }, { status: 400 });
        }

        if (price < 0 || stock < 0) {
            return NextResponse.json({
                success: false,
                message: "Price and stock must be positive or zero."
            }, { status: 400 });
        }

        const obj = {
            name: name.trim(),
            price: Number(price),
            stock: Number(stock),
            status,
            category: {
                connect: {
                    id: Number(category)
                }
            }
        };

        if (description !== undefined) {
            obj.description = description;
        }

        const newProduct = await prisma.product.create({
            data: obj
        });

        return NextResponse.json({
            success: true,
            message: "Product created successfully!",
            product: newProduct
        }, { status: 201 });

    } catch (error) {
        console.log(error.message);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error!"
        }, { status: 500 });
    }
}

