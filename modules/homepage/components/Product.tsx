"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
  };
}

export interface ProductType {
  id: string;
  title: string;
  description?: string;
  shortDescription?: string;
  isBestChoice?: boolean;
  reviews?: Review[];
  discount?: number;
  image: string;
  regularPrice: number;
  salePrice: number;
  tags?: string[] | null;
  inStock: boolean;
  stock?: number; // Added stock property
  slug: string;
}

interface ProductProps {
  product: ProductType;
  isInWishlist?: boolean;
  wishlistItemId?: string;
  onWishlistChange?: () => void;
}


const Star: React.FC<{ count: number }> = ({ count }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => {
        const fillPercentage = Math.max(0, Math.min(1, count - (star - 1)));

        return (
          <div key={star} className="relative w-5 h-5">
            {/* Background Star (Grey) */}
            <svg
              className="absolute inset-0"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="#D3D3D3"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
            </svg>

            {/* Foreground (Gold) Star with Clipping */}
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${fillPercentage * 100}%` }}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="#FFD700"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
};


const Product: React.FC<ProductProps> = ({
  product,
  isInWishlist = false,
  wishlistItemId,
  onWishlistChange
}) => {
  const router = useRouter();
  const [inWishlist, setInWishlist] = useState(isInWishlist);
  const [currentWishlistItemId, setCurrentWishlistItemId] = useState(wishlistItemId);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [cartItemId, setCartItemId] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [isUpdatingCart, setIsUpdatingCart] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [isLoadingStock, setIsLoadingStock] = useState(true);
  const [maxStock, setMaxStock] = useState<number>(0);

  const calculateAverageRating = () => {
    if (!product?.reviews || product.reviews.length === 0) return 0;
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / product.reviews.length;
  };


  // Assume a default stock if not provided
  useEffect(() => {
    const fetchProductStock = async () => {
      if (!product.id) return;

      setIsLoadingStock(true);
      try {
        const response = await fetch(`/api/products/count?productId=${product.id}`);

        if (response.ok) {
          const { data } = await response.json();
          setMaxStock(data.stock);
        } else {
          // If API fails, fall back to the stock from props
          setMaxStock(product.stock || 0);
        }
      } catch (error) {
        console.error("Error fetching product stock:", error);
        // Fallback to product prop on error
        setMaxStock(product.stock || 0);
      } finally {
        setIsLoadingStock(false);
      }
    };

    fetchProductStock();
  }, [product.id, product.stock]);

  // Update local state when props change
  useEffect(() => {
    setInWishlist(isInWishlist);
    setCurrentWishlistItemId(wishlistItemId);
  }, [isInWishlist, wishlistItemId]);

  // Check if product is in cart when component mounts or user changes
  useEffect(() => {
    if (userId) {
      checkCartStatus();
    }
  }, [userId, product.id]);

  // Function to check if product is in user's cart
  const checkCartStatus = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/cart?userId=${userId}`);

      if (response.ok) {
        const { data } = await response.json();

        if (data && data.items) {
          // Find if this product is in the cart
          const cartItem = data.items.find((item: any) => item.productId === product.id);

          if (cartItem) {
            setInCart(true);
            setCartItemId(cartItem.id);
            setCartQuantity(cartItem.quantity || 1);
            setQuantity(cartItem.quantity || 1);
          } else {
            setInCart(false);
            setCartItemId(undefined);
            setCartQuantity(0);
            setQuantity(1);
          }
        }
      }
    } catch (error) {
      console.error("Error checking cart status:", error);
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigating to product page

    if (!userId) {
      // Redirect to login if user is not authenticated
      router.push('/login');
      return;
    }

    setIsWishlistLoading(true);

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
          // Notify parent component about the change
          if (onWishlistChange) onWishlistChange();
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
          setCurrentWishlistItemId(data.data.id);
          // Notify parent component about the change
          if (onWishlistChange) onWishlistChange();
        }
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const handleCartToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigating to product page

    if (!userId) {
      // Redirect to login if user is not authenticated
      router.push('/login');
      return;
    }

    if (!product.inStock && !inCart) {
      return; // Don't proceed if product is out of stock and not already in cart
    }

    setIsCartLoading(true);

    try {
      if (inCart && cartItemId) {
        // Remove from cart
        const response = await fetch(`/api/cart/${cartItemId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setInCart(false);
          setCartItemId(undefined);
          setCartQuantity(0);
          setQuantity(1);
        }
      } else {
        // Add to cart
        const response = await fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            productId: product.id,
            quantity: quantity
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setInCart(true);
          setCartItemId(data.data.id);
          setCartQuantity(quantity);
        } else {
          const errorData = await response.json();
          console.error("Error adding to cart:", errorData.message);
        }
      }
    } catch (error) {
      console.error("Error toggling cart:", error);
    } finally {
      setIsCartLoading(false);
    }
  };

  const updateCartQuantity = async (newQuantity: number) => {
    if (!userId || !cartItemId || !inCart) return;

    setIsUpdatingCart(true);

    try {
      const response = await fetch(`/api/cart/${cartItemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: newQuantity
        }),
      });

      if (response.ok) {
        setCartQuantity(newQuantity);
      } else {
        // Revert to previous quantity on failure
        setQuantity(cartQuantity);
        const errorData = await response.json();
        console.error("Error updating cart quantity:", errorData.message);
      }
    } catch (error) {
      console.error("Error updating cart quantity:", error);
      // Revert to previous quantity on error
      setQuantity(cartQuantity);
    } finally {
      setIsUpdatingCart(false);
    }
  };

  const handleQuantityChange = (newQuantity: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation(); // Prevent navigating to product page
    }

    // Ensure quantity is within bounds
    const validQuantity = Math.max(1, Math.min(newQuantity, maxStock));

    if (validQuantity !== quantity) {
      setQuantity(validQuantity);

      // If product is in cart, update the cart quantity
      if (inCart) {
        updateCartQuantity(validQuantity);
      }
    }
  };

  // Format price display
  const formatPrice = (price: number) => {
    let newPrice = price.toFixed(2)
    return `£${newPrice}`;
  };

  // Calculate discount percentage
  const discountPercentage = product.regularPrice > product.salePrice
    ? Math.round(((product.regularPrice - product.salePrice) / product.regularPrice) * 100)
    : 0;

  return (
    <div
      onClick={() => router.push(`/products/${product.id}`)}
      className="w-68 bg-white border border-gray-150 shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden cursor-pointer"
    >
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <div className="absolute top-2 left-0 bg-blue-500 text-white px-2 py-1 text-xs font-medium z-10 flex items-center after:content-[''] after:absolute after:top-0 after:right-0 after:border-t-[14px] after:border-b-[14px] after:border-l-[14px] after:border-t-transparent after:border-b-transparent after:border-l-blue-500 after:translate-x-full">
          -{discountPercentage}%
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        disabled={isWishlistLoading}
        className="absolute top-2 right-2 z-10"
      >
        {isWishlistLoading ? (
          <div className="w-4 h-4 border-2 border-gray-300 border-t-amber-500 rounded-full animate-spin"></div>
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={inWishlist ? "#FFA500" : "none"}
            stroke={inWishlist ? "#FFA500" : "#000000"}
            strokeWidth="2"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
        )}
      </button>

      {/* Product Image */}
      <div className="relative pt-4 flex items-center justify-center h-48">
        <Image
          src={product.image}
          alt={product.title}
          width={160}
          height={160}
          className="object-contain w-full h-full transition-transform duration-300 hover:scale-105"
          priority={false}
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Title */}
        <h3 className="text-base font-medium text-gray-800 mb-1 line-clamp-2 h-12">
          {product.title}
        </h3>

        {/* Price Section */}
        <div className="flex justify-between">
          <div className="flex items-center space-x-2 flex-row mb-2">
            <span className="text-amber-500 font-bold text-lg">
              {formatPrice(product.salePrice)}
            </span>
            {product.regularPrice > product.salePrice && (
              <span className="text-gray-500 line-through text-sm">
                {formatPrice(product.regularPrice)}
              </span>
            )}
          </div>
          <div className="flex items-center min-h-14 mb-3">
            {product.inStock && (
              <div className="flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                <div className="text-xs text-gray-500">
                  {isLoadingStock ? (
                    <div className="w-3 h-3 border-2 border-gray-300 border-t-amber-500 rounded-full animate-spin"></div>
                  ) : (
                    `${maxStock} available`
                  )}
                </div>
              </div>
            )}
            {!product.inStock && (
              <div className="flex items-center justify-center py-2 text-sm text-red-500 font-medium">
                Out of stock
              </div>
            )}
          </div>

        </div>

        {/* Rating Stars */}
        <div className="flex items-center mb-4">
          <Star count={calculateAverageRating()} />
          {/* Sales Info */}
          {/* <div className="ml-2 text-xs text-gray-500">
            4.3 k+ Sold
          </div> */}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleCartToggle}
          disabled={isCartLoading || (!product.inStock && !inCart)}
          className={`w-full mt-2 py-2 px-4  ${inCart
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-amber-500 hover:bg-amber-600 text-white'
            } font-semibold transition-colors flex items-center justify-center ${!product.inStock && !inCart ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          {isCartLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          ) : null}
          <span>
            {inCart ? "Remove from cart" : "Add to cart"}
          </span>
          <svg
            className="ml-2"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zM3 6h18"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 10a4 4 0 11-8 0"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Product;