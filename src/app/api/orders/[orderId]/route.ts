import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET request handler: Fetch an order by ID
export async function GET(request: Request, { params }: { params: { orderId: string } }) {
  try {
    const { orderId } = params;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

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

// PUT request handler: Update an order
export async function PUT(req: Request, { params }: { params: { orderId: string } }) {
  try {
    const orderId = params.orderId;
    const { status, paymentMethod, paymentStatus } = await req.json();

    // Fetch the order along with its payment record
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if the order has an associated payment record
    if (!order.payment) {
      // If no payment record exists, create one
      await prisma.payment.create({
        data: {
          orderId: orderId, // Assuming `orderId` is the foreign key in Payment
          method: paymentMethod || "UNKNOWN",
          status: paymentStatus || "PENDING",
        },
      });
    }

    // Update the order and payment details
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status, // e.g., "CONFIRMED"
        payment: {
          update: {
            method: paymentMethod || order.payment?.method, // Preserve existing if not provided
            status: paymentStatus || order.payment?.status, // Preserve existing if not provided
          },
        },
      },
      include: {
        items: { include: { product: true } },
        payment: true,
      },
    });

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
