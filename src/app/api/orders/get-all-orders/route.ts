import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET request handler: Fetch all orders
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: { id: true, email: true },
        },
        items: {
          include: { product: true },
        },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: orders }, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
