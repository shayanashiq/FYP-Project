// app/api/subcategories/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const subcategory = await prisma.subCategory.findUnique({
      where: { id },
      include: {
        category: true,
        products: true
      }
    });
    
    if (!subcategory) {
      return NextResponse.json(
        { error: 'Subcategory not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(subcategory);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch subcategory' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { name, description, categoryId } = await request.json();
    
    if (!name) {
      return NextResponse.json(
        { error: 'Subcategory name is required' },
        { status: 400 }
      );
    }
    
    const updateData: any = {
      name,
      description: description || undefined
    };
    
    // If categoryId is provided, update the parent category
    if (categoryId) {
      // Check if the new parent category exists
      const categoryExists = await prisma.category.findUnique({
        where: { id: categoryId }
      });
      
      if (!categoryExists) {
        return NextResponse.json(
          { error: 'Parent category not found' },
          { status: 404 }
        );
      }
      
      updateData.categoryId = categoryId;
    }
    
    const updatedSubcategory = await prisma.subCategory.update({
      where: { id },
      data: updateData
    });
    
    return NextResponse.json(updatedSubcategory);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update subcategory' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Check if the subcategory has products
    const subcategoryWithProducts = await prisma.subCategory.findUnique({
      where: { id },
      include: {
        products: {
          select: { id: true },
          take: 1
        }
      }
    });
    
    if (subcategoryWithProducts?.products.length) {
      return NextResponse.json(
        { error: 'Cannot delete subcategory with associated products' },
        { status: 400 }
      );
    }
    
    // Delete the subcategory
    await prisma.subCategory.delete({
      where: { id }
    });
    
    return NextResponse.json({ message: 'Subcategory deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete subcategory' },
      { status: 500 }
    );
  }
}