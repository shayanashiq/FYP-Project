// app/api/categories/[id]/subcategories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Check if the category exists
    const category = await prisma.category.findUnique({
      where: { id }
    });
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Get all subcategories for this category
    const subcategories = await prisma.subCategory.findMany({
      where: {
        categoryId: id
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    return NextResponse.json(subcategories);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch subcategories' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { name, description } = await request.json();
    
    if (!name) {
      return NextResponse.json(
        { error: 'Subcategory name is required' },
        { status: 400 }
      );
    }
    
    // Check if the category exists
    const category = await prisma.category.findUnique({
      where: { id }
    });
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Create a new subcategory under this category
    const subcategory = await prisma.subCategory.create({
      data: {
        name,
        description: description || undefined,
        categoryId: id
      }
    });
    
    return NextResponse.json(subcategory, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create subcategory' },
      { status: 500 }
    );
  }
}