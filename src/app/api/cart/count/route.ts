// app/api/cart/count/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get the user session
    const session = await getServerSession();
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ count: 0 }, { status: 401 });
    }
    
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { cart: { include: { items: true } } }
    });
    
    // If user doesn't exist or doesn't have a cart yet
    if (!user || !user.cart) {
      return NextResponse.json({ count: 0 });
    }
    
    // Calculate the total number of items in cart
    const count = user.cart.items.reduce((total, item) => total + item.quantity, 0);
    
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching cart count:', error);
    return NextResponse.json({ error: 'Failed to fetch cart count' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}