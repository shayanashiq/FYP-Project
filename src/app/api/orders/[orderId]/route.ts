import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET request handler: Fetch an order by ID
export async function GET(request: Request, { params }: { params: { orderId: string } }) {
  try {
    const { orderId } = params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } }, payment: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ data: order }, { status: 200 });
  } catch (error) {
    console.error("Order retrieval error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT request handler: Update an order and deduct stock
export async function PUT(req: Request, { params }: { params: { orderId: string } }) {
  try {
    const { orderId } = params;
    const { status, paymentMethod, paymentStatus } = await req.json();

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, payment: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Ensure the payment record exists
    await prisma.payment.upsert({
      where: { orderId },
      update: {
        method: paymentMethod || order.payment?.method,
        status: paymentStatus || order.payment?.status,
      },
      create: {
        orderId,
        method: paymentMethod || "UNKNOWN",
        status: paymentStatus || "PENDING",
      },
    });

    // Deduct stock for ordered items
    await Promise.all(
      order.items.map((item) =>
        prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      )
    );

    // Update the order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { items: { include: { product: true } }, payment: true },
    });

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
