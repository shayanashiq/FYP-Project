"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  discount?: number;
  images: string[];
  stock: number;
}

interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
}

interface Wishlist {
  id: string;
  userId: string;
  items: WishlistItem[];
}

export default function Wishlist() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    // Fetch wishlist items if authenticated
    if (status === "authenticated" && session?.user?.id) {
      fetchWishlist(session.user.id);
    }
  }, [status, session, router]);

  const fetchWishlist = async (userId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/wishlist?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWishlist(data.data);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch("/api/wishlist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: session.user.id, itemId }),
      });

      if (response.ok) {
        // Refresh wishlist data
        fetchWishlist(session.user.id);
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="container mx-auto py-10 flex justify-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>

      {wishlist && wishlist.items && wishlist.items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.items.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-square bg-gray-50">
                <Link href={`/products/${item.productId}`}>
                  <Image
                    src={item.product.images[0] || "/placeholder.png"}
                    alt={item.product.name}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </Link>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                  aria-label="Remove from wishlist"
                >
                  <svg
                    width="20"
                    height="18"
                    viewBox="0 0 20 18"
                    fill="#f87171"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.5166 16.8874C10.2333 16.9957 9.77496 16.9957 9.49163 16.8874C6.99996 15.9707 1.25 12.2541 1.25 6.1207C1.25 3.33333 3.48329 1.08333 6.25413 1.08333C7.88329 1.08333 9.32496 1.83333 10.0041 3.00833C10.6833 1.83333 12.1333 1.08333 13.7541 1.08333C16.525 1.08333 18.7583 3.33333 18.7583 6.1207C18.7583 12.2541 13.0083 15.9707 10.5166 16.8874Z"
                      stroke="#f87171"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              
              <div className="p-4">
                <Link href={`/products/${item.productId}`}>
                  <h2 className="text-lg font-semibold mb-2 line-clamp-2">
                    {item.product.name}
                  </h2>
                </Link>
                
                <div className="flex items-center gap-2 mb-4">
                  {item.product.discount && item.product.discount > 0 ? (
                    <>
                      <span className="text-gray-500 line-through text-sm">
                        ${Number(item.product.price).toFixed(2)}
                      </span>
                      <span className="text-red-500 font-bold text-lg">
                        ${(Number(item.product.price) - Number(item.product.discount)).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-800 font-bold text-lg">
                      ${Number(item.product.price).toFixed(2)}
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {item.product.stock > 0 ? (
                    <button className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 rounded-md transition-colors">
                      Add to cart
                    </button>
                  ) : (
                    <button disabled className="flex-1 py-2 bg-gray-200 text-gray-500 font-semibold px-4 rounded-md cursor-not-allowed">
                      Out of stock
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-6">Your wishlist is empty</p>
          <Link href="/products" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-md transition-colors">
            Browse Products
          </Link>
        </div>
      )}
    </div>
  );
}