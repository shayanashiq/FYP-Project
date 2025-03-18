"use client";

import React, { useState, useRef, useEffect } from "react";
import Product, { ProductType } from "./Product";

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
  color?: string[];
  size?: string[];
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

const TopDeals: React.FC = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Fetch top deals products from API
  useEffect(() => {
    const fetchTopDeals = async () => {
      try { 
        setLoading(true);
        console.log('Fetching top deals products with discount >= 20%');
        
        // Update the API endpoint to filter for products with discount >= 20%
        const response = await fetch('/api/products?minDiscount=20&limit=50');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch top deals products: ${response.status}`);
        }
        
        const data: ApiResponse = await response.json();
        console.log('API Response:', data);
        
        // Map API products to component's ProductType format
        const formattedProducts = data.products.map(product => {
          // Make sure discount is a number
          const discountValue = typeof product.discount === 'number' ? product.discount : 0;
          
          // Calculate sale price (assuming discount is a percentage)
          const salePrice = product.price - (product.price * discountValue / 100);
          
          console.log(`Product ${product.name}: price=${product.price}, discount=${discountValue}%, salePrice=${salePrice}`);
          
          return {
            id: product.id,
            title: product.name,
            description: product.description || "",
            shortDescription: product.shortDescription || "",
            image: product.images && product.images.length > 0 ? product.images[0] : "/assets/img/8-1.png",
            regularPrice: product.price,
            salePrice: salePrice,
            tags: [
              ...(product.isBestChoice ? ["best choice"] : []),
              "sale", // Add 'sale' tag directly as a string, not as an array
              // Add other tag logic as needed
            ],
            inStock: product.stock > 0,
            slug: product.sku || product.id,
            discountPercentage: discountValue, // Add discount percentage to display
          };
        });
        
        console.log('Formatted products:', formattedProducts);
        setProducts(formattedProducts);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        console.error('Error fetching top deals products:', errorMessage);
        setError(errorMessage);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopDeals();
  }, []);

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
        Top Deals
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
                <p className="text-red-500">Error loading deals: {error}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">No top deals right now.</p>
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
                  {visibleProducts.map((product, index) => (
                    <Product key={`${product.id}-${index}`} product={product} />
                  ))}
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
                  <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white via-white/30 to-transparent z-10 pointer-events-none">
                    <button
                      onClick={handleNext}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-12 w-12 flex items-center justify-center rounded-full bg-gray-300 hover:bg-gray-400 shadow-md transition-all duration-300 pointer-events-auto"
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

export default TopDeals;