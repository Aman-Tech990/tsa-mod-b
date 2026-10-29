import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const orders = await prisma.order.findMany();

        if (!orders || orders.length === 0) {
            return NextResponse.json({
                success: false,
                message: "No orders found!"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "All orders fetched!",
            orders: orders
        }, { status: 200 });

    } catch (error) {
        console.log(error.message);
        return NextResponse.json({
            success: false,
            message: "Internal server error!"
        }, { status: 500 });
    }
}

export async function POST(req, { params }) {
    const id = await { params };

    try {

        const product = aawait prisma.product.

        const { customerName, customerPhone, shippingAddress, subTotal, status, couponCode } = req.josn();

        if (!customerName || !customerPhone || !shippingAddress || !subTotal || !status) {
            return NextResponse.json({
                success: false,
                message: "Except coupon all fields are required!"
            }, { status: 400 });
        }

        let finalAmount;
        if (couponCode) {
            const valid = await prisma.coupon.findUnique({
                where: {
                    code: couponCode
                }
            });

            if (!valid) {
                return NextResponse.json({
                    success: false,
                    message: "Coupon is invalid"
                }, { status: 400 });
            }

            finalAmount = subTotal - valid.discountValue;
        } else {
            finalAmount = subTotal;
        }

        const orderItem = await prisma.orderItem.create({

        });


    } catch (error) {
        console.log(error.message);
        return NextResponse.json({
            success: false,
            message: "Internal server error!"
        }, { status: 500 });
    }
}