import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Function to calculate similarity between strings
function calculateSimilarity(str1: string, str2: string): number {
  // Convert both strings to lowercase for case-insensitive comparison
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  // If exact match, return maximum similarity
  if (s1 === s2) return 1;
  
  // If one contains the other completely, high similarity
  if (s1.includes(s2)) return 0.9;
  if (s2.includes(s1)) return 0.9;
  
  // Count matching words
  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);
  
  let matchCount = 0;
  for (const word1 of words1) {
    if (word1.length > 2) { // Only consider words with more than 2 characters
      for (const word2 of words2) {
        if (word2.length > 2 && (word1.includes(word2) || word2.includes(word1))) {
          matchCount++;
          break;
        }
      }
    }
  }
  
  // Return a similarity score based on matching words
  const maxWords = Math.max(words1.length, words2.length);
  return maxWords > 0 ? matchCount / maxWords : 0;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse filters from query params with debug logging
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('category') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Log received parameters for debugging
    console.log('Search API Parameters:', {
      search,
      categoryId,
      minPrice,
      maxPrice,
      sort,
      page,
      limit
    });
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build a cleaner where clause
    let whereClause: any = {};
    
    // If we have a category ID, explicitly filter by it
    if (categoryId && categoryId.trim() !== '') {
      whereClause.categoryId = categoryId;
    }
    
    // Add price filters if they exist
    if (minPrice || maxPrice) {
      whereClause.price = {};
      
      if (minPrice) {
        whereClause.price.gte = parseFloat(minPrice);
      }
      
      if (maxPrice) {
        whereClause.price.lte = parseFloat(maxPrice);
      }
    }
    
    // Add search filter if it exists
    if (search && search.trim() !== '') {
      // If we already have filters, we need to use AND logic
      if (Object.keys(whereClause).length > 0) {
        // Convert existing filters to an AND array
        const existingFilters = { ...whereClause };
        whereClause = {
          AND: [
            existingFilters,
            {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { shortDescription: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ]
            }
          ]
        };
      } else {
        // If no existing filters, just use OR for search
        whereClause = {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { shortDescription: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ]
        };
      }
    }
    
    // Log the final where clause for debugging
    console.log('Final Prisma where clause:', JSON.stringify(whereClause, null, 2));
    
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
    
    // Execute queries with the new where clause
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
    
    // Log product count and categories
    console.log(`Found ${products.length} products matching criteria`);
    if (products.length > 0 && categoryId) {
      const categoryDistribution = products.reduce((acc, product) => {
        const cat = product.category?.name || 'Unknown';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      console.log('Category distribution in results:', categoryDistribution);
    }
    
    // Post-process products for search term similarity if needed
    let processedProducts = [...products];
    
    if (search) {
      // Score products by calculated similarity
      processedProducts = processedProducts.map(product => {
        const titleSimilarity = calculateSimilarity(product.name, search) * 3;
        const shortDescSimilarity = calculateSimilarity(product.shortDescription || '', search) * 2;
        const descSimilarity = calculateSimilarity(product.description || '', search);
        
        const overallSimilarity = (titleSimilarity + shortDescSimilarity + descSimilarity) / 6;
        
        return {
          ...product,
          _similarity: overallSimilarity
        };
      });
      
      // Filter out products with very low similarity
      processedProducts = processedProducts.filter(p => (p as any)._similarity > 0.1);
      
      // Sort by similarity if searching with default sort
      if (sort === 'newest') {
        processedProducts.sort((a, b) => (b as any)._similarity - (a as any)._similarity);
      }
    }
    
    // Calculate average rating for each product
    const productsWithRating = processedProducts.map(product => {
      const avgRating = product.reviews.length > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 0;
      
      const vendor = product.vendor ? {
        id: product.vendor.id,
        name: product.vendor.customerProfile
          ? `${product.vendor.customerProfile.firstName} ${product.vendor.customerProfile.lastName}`
          : 'Unknown Vendor'
      } : null;
      
      return {
        ...product,
        avgRating,
        reviewCount: product.reviews.length,
        vendor,
        reviews: undefined,
        _similarity: undefined,
      };
    });
    
    // Return response with pagination metadata
    return NextResponse.json({
      products: productsWithRating,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit) || 1
      }
    });
    
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json(
      { error: 'Failed to search products', details: (error as Error).message },
      { status: 500 }
    );
  }
}