import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate essential input
    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: "Invalid order data" },
        { status: 400 }
      );
    }

    // Validate email for guest orders
    if (!body.userId && (!body.guestEmail || !body.guestEmail.includes("@"))) {
      return NextResponse.json(
        { error: "Valid email is required for guest orders" },
        { status: 400 }
      );
    }

    // Calculate totalPrice from items with precise decimal calculation
    const totalPrice = body.items.reduce((acc: Prisma.Decimal, item: any) => {
      const finalPrice = new Prisma.Decimal(item.unitPrice)
        .mul(item.quantity)
        .mul(
          new Prisma.Decimal(1).sub(
            new Prisma.Decimal(item.discountPercentage || 0).div(100)
          )
        );
      return acc.add(finalPrice);
    }, new Prisma.Decimal(0));

    // Check product availability and stock
    for (const item of body.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { name: true, stock: true },
      });

      if (!product || product.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `${product?.name} is out of stock or insufficient quantity. Remove it from your cart to proceed.`,
          },
          { status: 400 }
        );
      }
    }

    // Create order with guest support
    const order = await prisma.$transaction(async (prisma) => {
      // Create the order
      const createdOrder = await prisma.order.create({
        data: {
          userId: body.userId || undefined,
          isGuestOrder: !body.userId,
          guestEmail: !body.userId ? body.guestEmail : undefined,
          totalPrice,
          status: "PENDING",
          shippingFirstName: body.shippingFirstName || "",
          shippingLastName: body.shippingLastName || "",
          shippingStreet: body.shippingStreet || "",
          shippingCity: body.shippingCity || "",
          shippingPostalCode: body.shippingPostalCode || "",
          shippingCountry: body.shippingCountry || "",
          shippingPhone: body.shippingPhone || "",
          items: {
            create: body.items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: new Prisma.Decimal(item.unitPrice),
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // Update product stock
      for (const item of body.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Handle cart cleanup based on user type
      if (body.userId) {
        const userCart = await prisma.cart.findUnique({
          where: { userId: body.userId },
          include: { items: true },
        });

        if (userCart) {
          const deletedItems = await prisma.cartItem.deleteMany({
            where: {
              cartId: userCart.id,
              productId: {
                in: body.items.map((item: any) => item.productId),
              },
            },
          });

          // Verify remaining items
          const remainingItems = await prisma.cartItem.count({
            where: { cartId: userCart.id },
          });

          if (remainingItems === 0) {
            await prisma.cart.delete({
              where: { id: userCart.id },
            });
          }
        } 
      } else if (body.guestCartId) {
        const guestCart = await prisma.cart.findUnique({
          where: { id: body.guestCartId },
          include: { items: true },
        });

        if (guestCart) {
          const deletedItems = await prisma.cartItem.deleteMany({
            where: {
              cartId: body.guestCartId,
              productId: {
                in: body.items.map((item: any) => item.productId),
              },
            },
          });

          // Verify remaining items
          const remainingItems = await prisma.cartItem.count({
            where: { cartId: body.guestCartId },
          });

          if (remainingItems === 0) {
            await prisma.cart.delete({
              where: { id: body.guestCartId },
            });
          }
        } 
      }

      return createdOrder;
    });

    // Return response with cart cleanup information
    const responseData = {
      data: order,
      cartCleanup: {
        clearedCart: !!body.userId || !!body.guestCartId,
        cartId: body.guestCartId || null,
        isGuest: !body.userId,
      },
    };

    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // Validate order ID
    if (!id) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Prepare update data - only include fields that are not null/undefined
    const updateData = {
      // Status and payment info
      status: body.status || "CONFIRMED",
      paymentMethod: body.paymentMethod,
      email: body.email,
      
      // Shipping information
      shippingFirstName: body.shippingFirstName || "",
      shippingLastName: body.shippingLastName || "",
      shippingStreet: body.shippingStreet || "",
      shippingCity: body.shippingCity || "",
      shippingState: body.shippingState || "",
      shippingPostalCode: body.shippingPostalCode || "",
      shippingCountry: body.shippingCountry || "",
      shippingPhone: body.shippingPhone || "",
      
      // Billing information (only if provided)
      ...(body.billingFirstName !== null && body.billingFirstName !== undefined && {
        billingFirstName: body.billingFirstName,
      }),
      ...(body.billingLastName !== null && body.billingLastName !== undefined && {
        billingLastName: body.billingLastName,
      }),
      ...(body.billingStreet !== null && body.billingStreet !== undefined && {
        billingStreet: body.billingStreet,
      }),
      ...(body.billingCity !== null && body.billingCity !== undefined && {
        billingCity: body.billingCity,
      }),
      ...(body.billingState !== null && body.billingState !== undefined && {
        billingState: body.billingState,
      }),
      ...(body.billingPostalCode !== null && body.billingPostalCode !== undefined && {
        billingPostalCode: body.billingPostalCode,
      }),
      ...(body.billingCountry !== null && body.billingCountry !== undefined && {
        billingCountry: body.billingCountry,
      }),
      
      // User identification
      ...(body.userId && { userId: body.userId }),
      ...(body.guestEmail && { guestEmail: body.guestEmail }),
    };

    // Update the order
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ data: updatedOrder }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const guestEmail = searchParams.get("guestEmail");

    // Support both user and guest order retrieval
    if (!userId && !guestEmail) {
      return NextResponse.json(
        { error: "User ID or Guest Email is required" },
        { status: 400 }
      );
    }

    const orders = await prisma.order.findMany({
      where: userId
        ? { userId }
        : {
            isGuestOrder: true,
            guestEmail: guestEmail || undefined,
          },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: orders }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
