import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const itemId = url.searchParams.get("itemId");
    const session = await getServerSession();
    const guestCartId = cookies().get('guestCartId')?.value;

    if (!itemId) {
      return NextResponse.json(
        { message: "Cart item ID is required" },
        { status: 400 }
      );
    }

    // Check if cart item exists and belongs to user/guest
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true }
    });

    if (!cartItem) {
      return NextResponse.json(
        { message: "Cart item not found" },
        { status: 404 }
      );
    }

    // Validate ownership
    const isAuthorized =
      (session?.user?.id && cartItem.cart.userId === session.user.id) ||
      (guestCartId && cartItem.cart.id === guestCartId);

    if (!isAuthorized) {
      return NextResponse.json(
        { message: "Unauthorized to remove this item" },
        { status: 403 }
      );
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json(
      { message: "Item removed from cart successfully", data: { itemId } },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}