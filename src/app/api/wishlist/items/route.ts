import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function POST(req: NextRequest) {
  try {
    const { userId, productId } = await req.json();
    
    if (!productId || !userId) {
      return NextResponse.json({ message: "Product ID and User ID are required" }, { status: 400 });
    }
    
    // Check if wishlist exists for the user
    let wishlist = await prisma.wishlist.findUnique({ 
      where: { userId } 
    });
    
    // If no wishlist exists, create one
    if (!wishlist) {
      wishlist = await prisma.wishlist.create({ 
        data: { userId } 
      });
    }
    
    // Check if item is already in the wishlist
    const existingItem = await prisma.wishlistItem.findFirst({
      where: { 
        wishlistId: wishlist.id, 
        productId 
      },
    });
    
    if (existingItem) {
      return NextResponse.json({ 
        message: "Item already in wishlist", 
        data: existingItem 
      }, { status: 200 });
    }
    
    // Add item to wishlist
    const newItem = await prisma.wishlistItem.create({
      data: { 
        wishlistId: wishlist.id, 
        productId 
      },
    });
    
    return NextResponse.json({ 
      message: "Item added to wishlist", 
      data: newItem 
    }, { status: 201 });
    
  } catch (error) {
    return NextResponse.json({ 
      message: "Failed to add to wishlist", 
      error: (error as Error).message
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId, itemId } = await req.json();
    
    if (!itemId || !userId) {
      return NextResponse.json({ 
        message: "Wishlist item ID and User ID are required" 
      }, { status: 400 });
    }
    
    // First get the user's wishlist
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId }
    });

    if (!wishlist) {
      return NextResponse.json({
        message: "Wishlist not found"
      }, { status: 404 });
    }
    
    // Verify item belongs to the user's wishlist before deleting
    const item = await prisma.wishlistItem.findFirst({
      where: { 
        id: itemId,
        wishlistId: wishlist.id
      },
    });
    
    if (!item) {
      return NextResponse.json({ 
        message: "Wishlist item not found" 
      }, { status: 404 });
    }
    
    // Delete the item
    await prisma.wishlistItem.delete({ 
      where: { id: itemId } 
    });
    
    return NextResponse.json({ 
      message: "Item removed from wishlist" 
    }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json({ 
      message: "Failed to remove wishlist item",
      error: (error as Error).message
    }, { status: 500 });
  }
}