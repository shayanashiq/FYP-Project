// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Function to calculate similarity score between two strings
function similarity(s1: string, s2: string): number {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();
  
  // Simple implementation inspired by difflib
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  
  // Early return for edge cases
  if (longer.length === 0) return 1.0;
  if (shorter.length === 0) return 0.0;
  
  // Check for exact match or substring
  if (longer.includes(shorter)) return 0.8 + (0.2 * (shorter.length / longer.length));
  
  // Count matching characters
  let matches = 0;
  const longerArray = longer.split('');
  const shorterArray = shorter.split('');
  
  for (const char of shorterArray) {
    const index = longerArray.indexOf(char);
    if (index !== -1) {
      matches++;
      longerArray[index] = '';  // Mark as used
    }
  }
  
  return matches / longer.length;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse filters from query params
    const search = searchParams.get('search') || '';
    const categories = searchParams.get('categories') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build query filters
    const whereClause: any = {};
    
    // Category filter
    if (categories) {
      const categoryIds = categories.split(',').filter(Boolean);
      if (categoryIds.length > 0) {
        whereClause.categoryId = {
          in: categoryIds
        };
      }
    }
    
    // Price range filter
    if (minPrice) {
      whereClause.price = {
        ...whereClause.price,
        gte: parseFloat(minPrice)
      };
    }
    
    if (maxPrice) {
      whereClause.price = {
        ...whereClause.price,
        lte: parseFloat(maxPrice)
      };
    }
    
    // Search filter - only apply if search term exists AND
    // 1. No categories selected OR
    // 2. Only one category selected
    const categoryIds = categories ? categories.split(',').filter(Boolean) : [];
    
    if (search && (categoryIds.length <= 1)) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { color: { has: search } },  // Search in array fields
        { size: { has: search } },   // Search in array fields
        // Add other searchable fields here
      ];
    }
    
    // Sort options
    let orderBy: any;
    switch (sort) {
      case 'price-asc':
        orderBy = { price: 'asc' };
        break;
      case 'price-desc':
        orderBy = { price: 'desc' };
        break;
      case 'name-asc':
        orderBy = { name: 'asc' };
        break;
      case 'name-desc':
        orderBy = { name: 'desc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
    }
    
    // Execute main query to get products
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: {
          category: {
            select: {
              id: true,
              name: true
            }
          },
          subcategory: {
            select: {
              id: true,
              name: true
            }
          },
          vendor: {
            select: {
              id: true,
              customerProfile: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          },
          reviews: {
            select: {
              rating: true
            }
          }
        },
        skip,
        take: limit,
        orderBy
      }),
      prisma.product.count({
        where: whereClause
      })
    ]);
    
    // Post-process results for enhanced search if search term exists and 0 or 1 category selected
    let processedProducts = products;
    
    if (search && categoryIds.length <= 1) {
      // Get all products when no database results or to augment search results
      if (products.length < limit) {
        // Get additional products that might match via similarity
        const additionalProducts = await prisma.product.findMany({
          where: {
            // Exclude already found products
            id: { notIn: products.map(p => p.id) },
            // Apply category filter if any
            ...(categoryIds.length === 1 ? { categoryId: categoryIds[0] } : {})
          },
          include: {
            category: { select: { id: true, name: true } },
            subcategory: { select: { id: true, name: true } },
            vendor: {
              select: {
                id: true,
                customerProfile: {
                  select: { firstName: true, lastName: true }
                }
              }
            },
            reviews: { select: { rating: true } }
          },
          take: limit * 5  // Get more to filter by similarity
        });
        
        // Calculate similarity scores for all additional products
        const scoredProducts = additionalProducts.map(product => {
          // Calculate similarity with search term for different fields
          const nameScore = similarity(product.name, search) * 1.0;  // Higher weight for name
          const shortDescScore = product.shortDescription ? 
            similarity(product.shortDescription, search) * 0.8 : 0;
          const descScore = similarity(product.description, search) * 0.6;
          
          // Use maximum score among all fields
          const maxScore = Math.max(nameScore, shortDescScore, descScore);
          
          return {
            product,
            score: maxScore
          };
        });
        
        // Filter only products with decent similarity
        const threshold = 0.3;  // Minimum similarity threshold
        const filteredAdditional = scoredProducts
          .filter(item => item.score >= threshold)
          .sort((a, b) => b.score - a.score)  // Sort by score descending
          .map(item => item.product);
        
        // Combine original and additional results, prioritizing original results
        processedProducts = [
          ...products,
          ...filteredAdditional.slice(0, limit - products.length)
        ];
      }
    }
    
    // Calculate average rating for each product
    const productsWithRating = processedProducts.map(product => {
      // Calculate average rating
      const avgRating = product.reviews.length > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 0;
      
      // Format vendor name if available
      const vendor = product.vendor ? {
        id: product.vendor.id,
        name: product.vendor.customerProfile
          ? `${product.vendor.customerProfile.firstName} ${product.vendor.customerProfile.lastName}`
          : 'Unknown Vendor'
      } : null;
      
      // Return formatted product
      return {
        ...product,
        avgRating,
        reviewCount: product.reviews.length,
        vendor,
        reviews: undefined // Remove the reviews array since we've calculated the average
      };
    });
    
    // Return response with pagination metadata
    return NextResponse.json({
      products: productsWithRating,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
    
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
}