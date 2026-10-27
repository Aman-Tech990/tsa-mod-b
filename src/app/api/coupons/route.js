import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const coupons = await prisma.coupon.findMany({
            orderBy: {
                createdAt: "asc"
            }
        });

        if (!coupons || coupons === undefined) {
            return NextResponse.json({
                success: false,
                message: "Coupons not found!"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "All coupons fetched",
            coupons: coupons
        }, { status: 200 });

    } catch (error) {
        console.log(error.message);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error!"
        });
    }
}

export async function POST(req) {
    try {
        const { code, discountType, discountValue, minOrderAmt, expiresAt, usageLimit } = await req.json();

        if (code === undefined || discountType === undefined || discountValue === undefined || minOrderAmt === undefined || expiresAt === undefined || usageLimit === undefined) {
            return NextResponse.json({
                success: false,
                message: "Mandatory fields cannot be blank!"
            }, { status: 400 });
        }

        const exitsCode = await prisma.coupon.findUnique({
            where: {
                code
            }
        });

        if (exitsCode) {
            return NextResponse.json({
                success: false,
                message: "Coupon code should be unique!"
            }, { status: 400 });
        }

        if (code.length < 6 || code.length > 12) {
            return NextResponse.json({
                success: false,
                message: "Coupon code must be between 6-12 characters!"
            }, { status: 400 });
        }

        let isValid = true;
        for (const ch of code) {
            if ((ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9')) {
                continue;
            } else {
                isValid = false;
                break;
            }
        }

        if (!isValid) {
            return NextResponse.json({
                success: false,
                message: "Coupon code must only contain Uppercase letters or digits!"
            }, { status: 400 });
        }

        if (
            !Number.isInteger(Number(discountValue)) ||
            !Number.isInteger(Number(minOrderAmt)) ||
            !Number.isInteger(Number(usageLimit))
        ) {
            return NextResponse.json({
                success: false,
                message: "Amount and usage must be valid Integer!"
            }, { status: 400 });
        }

        if (Number(minOrderAmt) < 0) {
            return NextResponse.json({
                success: false,
                message: "Coupon cannot be applied to orders below this amount!"
            }, { status: 400 });
        }

        if (discountType !== "Percent" && discountType !== "Fixed") {
            return NextResponse.json({
                success: false,
                message: "Discount type must be Percentage or fixed!"
            }, { status: 400 });
        }

        if (discountType === "Percent") {
            if (Number(discountValue) <= 0 || Number(discountValue) > 100) {
                return NextResponse.json({
                    success: false,
                    message: "Discount percentage must be within 1 and 100!"
                }, { status: 400 });
            }
        } else {
            const numberDiscount = Number(discountValue);
            if (numberDiscount <= 0) {
                return NextResponse.json({
                    success: false,
                    message: "Discount Value must be atleast 1!"
                }, { status: 400 });
            }
        }

        if (Number(usageLimit) <= 0) {
            return NextResponse.json({
                success: false,
                message: "Usage Limit must be atleast 1!"
            }, { status: 400 });
        }

        const expiryDate = new Date(expiresAt);
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        if (isNaN(expiryDate.getTime()) || expiryDate <= today) {
            return NextResponse.json({
                success: false,
                message: "Only future dates allowed!"
            }, { status: 400 });
        }

        const data = {};
        data.code = code;
        data.discountType = discountType;
        data.discountValue = Number(discountValue);
        data.minOrderAmount = Number(minOrderAmt);
        data.expiresAt = new Date(expiresAt);
        data.usageLimit = Number(usageLimit);
        data.remainingUses = Number(usageLimit);

        const newCoupon = await prisma.coupon.create({
            data
        });

        return NextResponse.json({
            success: true,
            message: "New coupon created successfully!",
            coupon: newCoupon
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal server error!"
        }, { status: 500 });
    }
}