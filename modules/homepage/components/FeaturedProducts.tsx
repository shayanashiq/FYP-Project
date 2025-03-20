"use client";

import React, { useState, useRef, useEffect } from "react";
import Product, { ProductType } from "./Product";
import { useSession } from "next-auth/react";

interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
}

// Updated ProductType to match API response
interface ApiProductType {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  sku: string;
  images: string[];
  categoryId: string;
  vendorId: string;
  isFeatured: boolean;
  discount?: number;
  isBestChoice?: boolean;
  color?: string;
  size?: string;
  shortDescription?: string;
  category?: any;
  vendor?: {
    id: string;
    name: string;
  };
  reviews?: {
    rating: number;
  }[];
  avgRating?: number;
  reviewCount?: number;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ApiResponse {
  products: ApiProductType[];
  pagination: PaginationInfo;
}

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  // Fetch featured products from API
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        // Use your API endpoint, adding a filter for isFeatured=true
        const response = await fetch('/api/products?isFeatured=true&limit=50');
        
        if (!response.ok) {
          throw new Error('Failed to fetch featured products');
        }
        
        const data: ApiResponse = await response.json();
        
        // Map API products to component's ProductType format
        const formattedProducts = data.products.map(product => ({
          id: product.id,
          title: product.name,
          description: product.description || "",
          shortDescription: product.shortDescription || "",
          image: product.images && product.images.length > 0 ? product.images[0] : "/assets/img/8-1.png",
          regularPrice: product.price,
          salePrice: product.discount ? product.price - (product.price * product.discount / 100) : product.price,
          tags: [
            ...(product.isBestChoice ? ["best choice"] : []),
            ...(product.discount ? ["sale"] : []),
            // Add other tag logic as needed
          ],
          inStock: product.stock > 0,
          slug: product.sku || product.id,
        }));
        
        setProducts(formattedProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching featured products:', err);
        
        
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Fetch wishlist items whenever session changes or when products are loaded
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!session?.user?.id) return;
      
      try {
        const response = await fetch(`/api/wishlist?userId=${session.user.id}`);
        if (!response.ok) {
          console.error('Failed to fetch wishlist');
          return;
        }
        
        const data = await response.json();
        // Make sure we're accessing the correct property in the response
        // Based on your Wishlist component, it seems the API returns data.data
        setWishlistItems(data.data?.items || []);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    };
    
    if (session?.user?.id && products.length > 0) {
      fetchWishlist();
    }
  }, [session, products]);

  // Function to handle wishlist updates from child components
  const handleWishlistUpdate = (productId: string, isAdded: boolean, wishlistItemId?: string) => {
    setWishlistItems(prevItems => {
      if (isAdded) {
        // Add item to wishlist if not already present
        if (!prevItems.some(item => item.productId === productId)) {
          return [...prevItems, { 
            id: wishlistItemId || `temp-${Date.now()}`, 
            userId: session?.user?.id || '', 
            productId 
          }];
        }
      } else {
        // Remove item from wishlist
        return prevItems.filter(item => item.productId !== productId);
      }
      return prevItems;
    });
  };

  // Helper function to check if a product is in the wishlist
  const getWishlistInfo = (productId: string) => {
    const wishlistItem = wishlistItems.find(item => item.productId === productId);
    return {
      isInWishlist: !!wishlistItem,
      wishlistItemId: wishlistItem?.id
    };
  };

  // Function to handle next/prev clicks
  const handleNext = (): void => {
    if (currentIndex + 4 < products.length && !isAnimating) {
      setIsAnimating(true);
      setCurrentIndex(currentIndex + 4);

      // Reset animation state after animation completes
      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    }
  };

  const handlePrev = (): void => {
    if (currentIndex - 4 >= 0 && !isAnimating) {
      setIsAnimating(true);
      setCurrentIndex(currentIndex - 4);

      // Reset animation state after animation completes
      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    }
  };

  // Calculate which products to show in the current view plus next items for smooth transition
  const visibleProducts = products.slice(
    Math.max(0, currentIndex - 4),
    Math.min(products.length, currentIndex + 8)
  );

  // Update transform style when currentIndex changes
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${
        currentIndex * 21.25
      }rem)`;
    }
  }, [currentIndex]);

  return (
    <>
      <h1 className="mt-12 mx-12 mb-8 flex flex-col text-cyan-800 text-4xl font-medium">
        Featured Products
      </h1>
      <div className="flex justify-center items-center flex-col w-[96%]">
        <div className="container mx-auto relative">
          <div className="w-full overflow-hidden relative px-10">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-800"></div>
              </div>
            ) : error && products.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-red-500">Error loading featured products: {error}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">No featured products available.</p>
              </div>
            ) : (
              <>
                {/* Product slider with smooth transition */}
                <div
                  ref={sliderRef}
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ width: "fit-content" }}
                >
                  {/* Display all potentially visible products */}
                  {visibleProducts.map((product, index) => {
                    const { isInWishlist, wishlistItemId } = getWishlistInfo(product.id);
                    return (
                      <Product 
                        key={`${product.id}-${index}`} 
                        product={product} 
                        isInWishlist={isInWishlist}
                        wishlistItemId={wishlistItemId}
                      />
                    );
                  })}
                </div>

                {/* Left Arrow */}
                {currentIndex > 0 && (
                  <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white via-white/30 to-transparent z-10 pointer-events-none">
                    <button
                      onClick={handlePrev}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 h-12 w-12 flex items-center justify-center rounded-full bg-gray-300 hover:bg-gray-400 shadow-md transition-all duration-300 pointer-events-auto"
                      aria-label="Previous products"
                    >
                      <span className="text-3xl text-gray-700 hover:text-gray-900 transition-transform transform hover:scale-110">
                        &lt;
                      </span>
                    </button>
                  </div>
                )}

                {/* Right Arrow */}
                {currentIndex + 4 < products.length && (
                  <div>
                    <button
                      onClick={handleNext}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 h-12 w-12 flex items-center justify-center rounded-full bg-gray-300 hover:bg-gray-400 shadow-md transition-all duration-300 pointer-events-auto"
                      aria-label="Next products"
                    >
                      <span className="text-3xl text-gray-700 hover:text-gray-900 transition-transform transform hover:scale-110">
                        &gt;
                      </span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <button className="mt-4 mx-auto px-12 py-3 text-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 rounded-lg">
          See All
        </button>
      </div>
    </>
  );
};

export default FeaturedProducts;