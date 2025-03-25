import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.userId || !body.items || body.items.length === 0) {
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
    }

    // Calculate totalPrice from items
    const totalPrice = body.items.reduce((acc: number, item: any) => {
      const finalPrice = item.unitPrice * item.quantity * (1 - (item.discountPercentage || 0) / 100);
      return acc + finalPrice;
    }, 0);

    const order = await prisma.order.create({
      data: {
        userId: body.userId,
        totalPrice: totalPrice, // ✅ Add totalPrice
        status: "PENDING", // Default status
        items: {
          create: body.items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.unitPrice, // Change `unitPrice` to `price` to match Prisma schema
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ data: order }, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
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
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ data: orders }, { status: 200 });
  } catch (error) {
    console.error("Order retrieval error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}