import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate input
        if (!body.userId || !body.items || body.items.length === 0) {
            return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
        }

        // Calculate totalPrice from items with precise decimal calculation
        const totalPrice = body.items.reduce((acc: Prisma.Decimal, item: any) => {
            const finalPrice = new Prisma.Decimal(item.unitPrice)
                .mul(item.quantity)
                .mul(new Prisma.Decimal(1).sub(new Prisma.Decimal(item.discountPercentage || 0).div(100)));
            return acc.add(finalPrice);
        }, new Prisma.Decimal(0));

        // Prepare shipping and billing data
        const shippingData = {
            shippingFirstName: body.shippingFirstName || '',
            shippingLastName: body.shippingLastName || '',
            shippingStreet: body.shippingStreet || '',
            shippingCity: body.shippingCity || '',
            shippingState: body.shippingState || null,
            shippingPostalCode: body.shippingPostalCode || '',
            shippingCountry: body.shippingCountry || '',
            shippingPhone: body.shippingPhone || '',
            email: body.email || '',
        };

        const billingData = body.useSameAddress ? 
            {} : 
            {
                billingFirstName: body.billingFirstName || null,
                billingLastName: body.billingLastName || null,
                billingStreet: body.billingStreet || null,
                billingCity: body.billingCity || null,
                billingState: body.billingState || null,
                billingPostalCode: body.billingPostalCode || null,
                billingCountry: body.billingCountry || null,
            };

        const order = await prisma.order.create({
            data: {
                userId: body.userId,
                totalPrice,
                status: "PENDING",
                ...shippingData,
                ...billingData,
                items: {
                    create: body.items.map((item: any) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: new Prisma.Decimal(item.unitPrice)
                    })),
                },
            },
            include: { 
                items: {
                    include: { 
                        product: true 
                    } 
                } 
            },
        });

        return NextResponse.json({ data: order }, { status: 201 });
    } catch (error) {
        console.error("Order creation error:", error);
        return NextResponse.json({ 
            error: "Internal Server Error", 
            details: error instanceof Error ? error.message : "Unknown error" 
        }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const orders = await prisma.order.findMany({
            where: { userId },
            include: { 
                items: { 
                    include: { 
                        product: true 
                    } 
                } 
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ data: orders }, { status: 200 });
    } catch (error) {
        console.error("Order retrieval error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}