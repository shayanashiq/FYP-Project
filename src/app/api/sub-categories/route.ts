// app/api/subcategories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const subcategories = await prisma.subCategory.findMany({
      include: {
        category: true // Include parent category in the response
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

export async function POST(request: NextRequest) {
  try {
    const { name, description, categoryId } = await request.json();
    
    if (!name || !categoryId) {
      return NextResponse.json(
        { error: 'Subcategory name and categoryId are required' },
        { status: 400 }
      );
    }
    
    // Check if the parent category exists
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId }
    });
    
    if (!categoryExists) {
      return NextResponse.json(
        { error: 'Parent category not found' },
        { status: 404 }
      );
    }
    
    const subcategory = await prisma.subCategory.create({
      data: {
        name,
        description: description || undefined,
        categoryId
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