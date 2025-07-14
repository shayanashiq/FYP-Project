import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma' // Adjust the import path to your Prisma client

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const categoryId = searchParams.get('categoryId')
  const productId = searchParams.get('productId')

  if (!categoryId || !productId) {
    return NextResponse.json({ 
      message: 'Category ID and Product ID are required' 
    }, { status: 400 })
  }

  try {
    const recommendations = await prisma.product.findMany({
      where: {
        // Exclude the current product
        id: {
          not: productId
        },
        // Match the category
        categoryId: categoryId,
        // Either best choice or with high order count
        OR: [
          { isBestChoice: true },
          {
            orderItems: {
              some: {
                // You might want to adjust this logic based on your specific requirements
                // This is a simple way to find popular products
                quantity: {
                  gt: 10 // Products ordered more than 10 times
                }
              }
            }
          }
        ]
      },
      // Remove the include option, instead fetch reviews separately
      select: {
        id: true,
        name: true,
        price: true,
        discount: true,
        isBestChoice: true,
        images: true,
        stock: true,
        _count: {
          select: { 
            reviews: true,
            orderItems: true
          }
        },
        reviews: {
          select: {
            rating: true
          }
        }
      },
      // Limit the number of recommendations
      take: 4,
      // Optional: add some randomness to recommendations
      orderBy: {
        isBestChoice: 'desc' // Prioritize best choice products
      }
    });

    // Calculate average rating for each product
    const recommendationsWithRatings = recommendations.map(product => ({
      id: product.id,
      name: product.name,
      images: product.images,
      price: Number(product.price),
      stock: Number(product.stock),
      discount: product.discount ? Number(product.discount) : undefined,
      avgRating: product.reviews.length > 0 
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length 
        : 0,
      reviewCount: product._count.reviews,
      isBestChoice: product.isBestChoice
    }));

    return NextResponse.json(recommendationsWithRatings);
  } catch (error) {
    return NextResponse.json({ 
      message: 'Error fetching recommendations', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}