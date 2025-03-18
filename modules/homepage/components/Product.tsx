"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// Define the product type
export interface ProductType {
  id: string;
  title: string;
  description?: string;
  shortDescription?: string;
  isBestChoice?: boolean;
  discount?: number;
  image: string;
  regularPrice: number;
  salePrice: number;
  tags?: string[] | null;
  inStock: boolean;
  slug: string;
}

interface ProductProps {
  product: ProductType;
  isInWishlist?: boolean;
  wishlistItemId?: string; // Added to store the wishlist item ID
}

const Product: React.FC<ProductProps> = ({ product, isInWishlist = false, wishlistItemId }) => {
  const router = useRouter();
  const [inWishlist, setInWishlist] = useState(isInWishlist);
  const [currentWishlistItemId, setCurrentWishlistItemId] = useState(wishlistItemId);
  const [isLoading, setIsLoading] = useState(false);
  const {data: session} = useSession();
  const userId = session?.user?.id;
  
  // Sync state with props whenever they change
  useEffect(() => {
    setInWishlist(isInWishlist);
    setCurrentWishlistItemId(wishlistItemId);
  }, [isInWishlist, wishlistItemId]);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigating to product page
    e.preventDefault(); // Prevent any default actions
    
    if (!userId) {
      // Redirect to login if user is not authenticated
      router.push('/login');
      return;
    }

    setIsLoading(true);
    
    try {
      if (inWishlist && currentWishlistItemId) {
        // Remove from wishlist
        const response = await fetch('/api/wishlist', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, itemId: currentWishlistItemId }),
        });
        
        if (response.ok) {
          setInWishlist(false);
          setCurrentWishlistItemId(undefined);
        } else {
          console.error("Failed to remove from wishlist, status:", response.status);
        }
      } else {
        // Add to wishlist
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, productId: product.id }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setInWishlist(true);
          // Make sure we're accessing the correct property in the response
          setCurrentWishlistItemId(data.data.id);
        } else {
          console.error("Failed to add to wishlist, status:", response.status);
        }
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="w-80 max-h-[450px] m-2 shrink-0 bg-white border-[1px] border-gray-300 hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group">
      <div className="absolute top-2 left-2 flex flex-col gap-2 z-10">
        {product?.tags && product.tags.includes("best choice") && (
          <div className="bg-amber-500 text-white px-3 py-1 rounded-md text-sm font-medium shadow-md">
            Best choice
          </div>
        )}
      </div>

      {/* Favorite Button */}
      <button 
        onClick={handleWishlistToggle}
        disabled={isLoading}
        className="absolute top-2 right-2 bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors z-10"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        ) : (
          <svg
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill={inWishlist ? "#f87171" : "none"}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.5166 16.8874C10.2333 16.9957 9.77496 16.9957 9.49163 16.8874C6.99996 15.9707 1.25 12.2541 1.25 6.1207C1.25 3.33333 3.48329 1.08333 6.25413 1.08333C7.88329 1.08333 9.32496 1.83333 10.0041 3.00833C10.6833 1.83333 12.1333 1.08333 13.7541 1.08333C16.525 1.08333 18.7583 3.33333 18.7583 6.1207C18.7583 12.2541 13.0083 15.9707 10.5166 16.8874Z"
              stroke={inWishlist ? "#f87171" : "#292D32"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Product Image Container */}
      <div className="p-4 flex items-center justify-center bg-gray-50 relative overflow-hidden">
        <div onClick={() => router.push(`/products/${product?.slug}`)} className="cursor-pointer block w-full h-full">
          <div className="relative w-40 h-60 mx-auto">
            <Image
              src={product?.image}
              alt={product?.title || "Product image"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              priority={false}
            />
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="px-4">
        {/* Product Title */}
        <h3 
          className="text-lg font-medium text-gray-800 mb-2 line-clamp-2 cursor-pointer"
          onClick={() => router.push(`/products/${product?.slug}`)}
        >
          {product?.title}
        </h3>
        {product?.shortDescription && (
          <h4 className="text-md font-medium text-gray-800 mb-2 line-clamp-2 ">
            {product.shortDescription}
          </h4>
        )}

        {/* Price Section */}
        <div className="flex items-center gap-2 mb-4">
          {product?.regularPrice > product?.salePrice && (
            <span className="text-gray-500 line-through text-sm">
              ${product?.regularPrice}
            </span>
          )}
          <span className="text-red-500 font-bold text-lg">
            ${product?.salePrice}
          </span>
        </div>

        {/* Buttons Section */}
        <div className="flex gap-2">
          {product?.inStock ? (
            <button className="flex-1 h-12 bg-blue-300 hover:bg-blue-400 text-slate-800 font-semibold px-4 rounded-md transition-colors flex items-center justify-between">
              <span>Add to cart</span>
              <div className="w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.89203 1.9411H3.1399C3.91443 1.9411 4.52402 2.60806 4.45947 3.37543L3.86423 10.5184C3.76382 11.6873 4.68896 12.6914 5.86511 12.6914H13.5029C14.5356 12.6914 15.4392 11.8451 15.5181 10.8196L15.9054 5.44086C15.9914 4.25037 15.0878 3.28219 13.8902 3.28219H4.6316"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12.1116 16.2844C12.6067 16.2844 13.0081 15.883 13.0081 15.3879C13.0081 14.8928 12.6067 14.4915 12.1116 14.4915C11.6165 14.4915 11.2151 14.8928 11.2151 15.3879C11.2151 15.883 11.6165 16.2844 12.1116 16.2844Z"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.37436 16.2844C6.86946 16.2844 7.27081 15.883 7.27081 15.3879C7.27081 14.8928 6.86946 14.4915 6.37436 14.4915C5.87926 14.4915 5.47791 14.8928 5.47791 15.3879C5.47791 15.883 5.87926 16.2844 6.37436 16.2844Z"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </button>
          ) : (
            <button
              disabled
              className="flex-1 h-12 bg-gray-200 text-gray-500 font-semibold px-4 rounded-md cursor-not-allowed"
            >
              Out of stock
            </button>
          )}

          <div
            onClick={() => router.push(`/products/${product?.slug}`)}
            className="h-12 w-12 bg-blue-300 hover:bg-blue-400 rounded-md flex items-center justify-center transition-colors cursor-pointer"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.5289 12.1127C15.5289 14.0601 13.9553 15.6338 12.0079 15.6338C10.0605 15.6338 8.48682 14.0601 8.48682 12.1127C8.48682 10.1653 10.0605 8.59167 12.0079 8.59167C13.9553 8.59167 15.5289 10.1653 15.5289 12.1127Z"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.008 20.2465C15.4799 20.2465 18.7157 18.2008 20.968 14.66C21.8532 13.2733 21.8532 10.9423 20.968 9.55549C18.7157 6.01475 15.4799 3.96899 12.008 3.96899C8.53612 3.96899 5.30028 6.01475 3.04798 9.55549C2.1628 10.9423 2.1628 13.2733 3.04798 14.66C5.30028 18.2008 8.53612 20.2465 12.008 20.2465Z"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;