import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    request: Request, 
    { params }: { params: { id: string } }
) {
    try {
        const orderId = params.id;
        
        if (!orderId) {
            return NextResponse.json(
                { error: "Order ID is required" }, 
                { status: 400 }
            );
        }

        const orderWithDetails = await prisma.order.findUnique({
            where: { 
                id: orderId 
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                payment: true
            },
        });

        if (!orderWithDetails) {
            return NextResponse.json(
                { error: "Order not found" }, 
                { status: 404 }
            );
        }

        return NextResponse.json({ data: orderWithDetails }, { status: 200 });
    } catch (error) {
        
        return NextResponse.json(
            { 
                error: "Internal Server Error", 
                details: error instanceof Error ? error.message : 'Unknown error'
            }, 
            { status: 500 }
        );
    }
}