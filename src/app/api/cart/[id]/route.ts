// app/api/cart/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";


export async function DELETE(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  console.log('DELETE Cart Item - Received Request');
  console.log('Request URL:', request.url);
  console.log('Item ID from params:', params.id);

  try {
    const session = await getServerSession();
    const guestCartId = cookies().get('guestCartId')?.value;
    const itemId = params.id;

    console.log('Session User ID:', session?.user?.id);
    console.log('Guest Cart ID:', guestCartId);

    if (!itemId) {
      console.error('No item ID provided');
      return NextResponse.json(
        { message: "Cart item ID is required" },
        { status: 400 }
      );
    }

    // Additional logging for request body and search params
    const requestBody = await request.json().catch(() => ({}));
    console.log('Request Body:', requestBody);

    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams);
    console.log('Search Params:', searchParams);

    // Check if cart item exists
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true }
    });

    if (!cartItem) {
      console.error(`Cart item not found: ${itemId}`);
      return NextResponse.json(
        { message: "Cart item not found" },
        { status: 404 }
      );
    }

    console.log('Cart Item Details:', {
      cartItemId: cartItem.id,
      cartId: cartItem.cart.id,
      userId: cartItem.cart.userId,
    });

    // Validate ownership
    const isAuthorized = 
      (session?.user?.id && cartItem.cart.userId === session.user.id) ||
      (guestCartId && cartItem.cart.id === guestCartId);

    // Delete the cart item
    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    console.log(`Successfully deleted cart item: ${itemId}`);

    return NextResponse.json(
      { 
        message: "Item removed from cart successfully", 
        data: { itemId } 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing cart item:", error);
    return NextResponse.json(
      { message: "Internal server error", error: String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const itemId = params.id;
    const body = await request.json();
    const { quantity } = body;

    if (!itemId) {
      return NextResponse.json(
        { message: "Cart item ID is required" },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      return NextResponse.json(
        { message: "Quantity must be at least 1" },
        { status: 400 }
      );
    }

    // Get cart item to check product stock
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { product: true },
    });

    if (!cartItem) {
      return NextResponse.json(
        { message: "Cart item not found" },
        { status: 404 }
      );
    }

    if (cartItem.product.stock < quantity) {
      return NextResponse.json(
        { message: "Not enough stock available" },
        { status: 400 }
      );
    }

    // Update the cart item quantity
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return NextResponse.json(
      { 
        message: "Cart item quantity updated successfully",
        data: updatedCartItem
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating cart item:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}