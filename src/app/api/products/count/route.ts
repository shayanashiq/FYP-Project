import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    
    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId
      },
      select: {
        id: true,
        stock: true
      }
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: product.id,
        stock: product.stock
      }
    });
  } catch (error) {
    console.error('Error fetching product stock:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch product stock' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { productId, stock } = body;
    
    if (!productId || stock === undefined) {
      return NextResponse.json(
        { success: false, message: 'Product ID and stock are required' },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: {
        id: productId
      },
      data: {
        stock: stock
      },
      select: {
        id: true,
        stock: true
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: product.id,
        stock: product.stock
      }
    });
  } catch (error) {
    console.error('Error updating product stock:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update product stock' },
      { status: 500 }
    );
  }
}