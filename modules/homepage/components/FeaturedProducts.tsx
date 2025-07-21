// "use client";

// import React, { useState, useEffect } from "react";
// import Product, { ProductType } from "./Product";
// import { useSession } from "next-auth/react";
// import ProductListSkeleton from "../../products/components/ProductListSkeleton";
// import { useRouter } from "next/navigation";

// interface WishlistItem {
//   id: string;
//   userId: string;
//   productId: string;
// }

// // Updated ProductType to match API response
// interface ApiProductType {
//   id: string;
//   name: string;
//   description?: string;
//   price: number;
//   stock: number;
//   sku: string;
//   images: string[];
//   categoryId: string;
//   vendorId: string;
//   isFeatured: boolean;
//   discount?: number;
//   isBestChoice?: boolean;
//   color?: string;
//   size?: string;
//   shortDescription?: string;
//   category?: any;
//   vendor?: {
//     id: string;
//     name: string;
//   };
//   reviews?: {
//     rating: number;
//   }[];
//   avgRating?: number;
//   reviewCount?: number;
// }

// interface PaginationInfo {
//   total: number;
//   page: number;
//   limit: number;
//   totalPages: number;
// }

// interface ApiResponse {
//   products: ApiProductType[];
//   pagination: PaginationInfo;
// }

// const FeaturedProducts: React.FC = () => {
//   const [products, setProducts] = useState<any[]>([]);
//   const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const { data: session } = useSession();
//   const router = useRouter()

//   // Fetch featured products from API
//   useEffect(() => {
//     const fetchFeaturedProducts = async () => {
//       try {
//         setLoading(true);
//         // Use your API endpoint, adding a filter for isFeatured=true
//         const response = await fetch('/api/products?isFeatured=true&limit=10');
        
//         if (!response.ok) {
//           throw new Error('Failed to fetch featured products');
//         }
        
//         const data: ApiResponse = await response.json();
        
//         // Map API products to component's ProductType format
//         const formattedProducts = data.products.map(product => ({
//           id: product.id,
//           title: product.name,
//           description: product.description || "",
//           shortDescription: product.shortDescription || "",
//           image: product.images && product.images.length > 0 ? product.images[0] : "",
//           reviews: product.reviews && product.reviews.length > 0 ? product.reviews : [],
//           regularPrice: product.price,
//           salePrice: product.discount ? product.price - (product.price * product.discount / 100) : product.price,
//           tags: [
//             ...(product.isBestChoice ? ["best choice"] : []),
//             ...(product.discount ? ["sale"] : []),
//           ],
//           inStock: product.stock > 0,
//           slug: product.sku || product.id,
//         }));
        
//         setProducts(formattedProducts);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'An unknown error occurred');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFeaturedProducts();
//   }, []);

//   // Fetch wishlist items whenever session changes or when products are loaded
//   useEffect(() => {
//     const fetchWishlist = async () => {
//       if (!session?.user?.id) return;
      
//       try {
//         const response = await fetch(`/api/wishlist?userId=${session.user.id}`);
//         if (!response.ok) {
//           return;
//         }
        
//         const data = await response.json();
//         // Make sure we're accessing the correct property in the response
//         setWishlistItems(data.data?.items || []);
//       } catch (error) {
//         throw new Error('Failed to fetch wishlist items');
//       }
//     };
    
//     if (session?.user?.id && products.length > 0) {
//       fetchWishlist();
//     }
//   }, [session, products]);

//   // Helper function to check if a product is in the wishlist
//   const getWishlistInfo = (productId: string) => {
//     const wishlistItem = wishlistItems.find(item => item.productId === productId);
//     return {
//       isInWishlist: !!wishlistItem,
//       wishlistItemId: wishlistItem?.id
//     };
//   };

//   // Split products into two rows
//   const firstRowProducts = products.slice(0, 5);
//   const secondRowProducts = products.slice(5, 10);

//   return (
//     <div className="px-4 sm:px-8 md:px-12 lg:px-20 py-20">
//       <h1 className="mt-8 md:mt-12 mb-4 md:mb-8 text-cyan-800 text-2xl md:text-3xl lg:text-4xl font-medium text-center md:text-left">
//         Featured Products
//       </h1>
//       <div className="flex justify-center items-center flex-col w-full">
//         <div className="container mx-auto">
//           {loading ? (
//             <ProductListSkeleton/>
//           ) : error && products.length === 0 ? (
//             <div className="flex justify-center items-center h-64">
//               <p className="text-red-500">Error loading featured products: {error}</p>
//             </div>
//           ) : products.length === 0 ? (
//             <div className="flex justify-center items-center h-64">
//               <p className="text-gray-500">No featured products available.</p>
//             </div>
//           ) : (
//             <div>
//               {/* Products grid - mobile first approach */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
//                 {products.map((product) => {
//                   const { isInWishlist, wishlistItemId } = getWishlistInfo(product.id);
//                   return (
//                     <Product 
//                       key={product.id} 
//                       product={product} 
//                       isInWishlist={isInWishlist}
//                       wishlistItemId={wishlistItemId}
//                     />
//                   );
//                 })}
//               </div>
//             </div>
//           )}
//         </div>
//         <button 
//         onClick={()=>router.push("/products?type=featured")}
//         className="mt-6 md:mt-8 px-6 py-2 text-lg md:text-xl bg-[#205781] text-white rounded-md hover:bg-[#1a4a70] transition-colors">
//           See All
//         </button>
//       </div>
//     </div>
//   );
// };

// export default FeaturedProducts;


"use client";

import React, { useState, useEffect } from "react";
import Product, { ProductType } from "./Product";
import { useSession } from "next-auth/react";
import ProductListSkeleton from "../../products/components/ProductListSkeleton";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
}

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

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products?isFeatured=true&limit=10');
        
        if (!response.ok) throw new Error('Failed to fetch featured products');
        
        const data = await response.json();
        
        const formattedProducts = data.products.map((product: ApiProductType) => ({
          id: product.id,
          title: product.name,
          description: product.description || "",
          shortDescription: product.shortDescription || "",
          image: product.images?.[0] || "",
          reviews: product.reviews || [],
          regularPrice: product.price,
          salePrice: product.discount ? 
            product.price - (product.price * product.discount / 100) : 
            product.price,
          tags: [
            ...(product.isBestChoice ? ["best choice"] : []),
            ...(product.discount ? ["sale"] : []),
          ],
          inStock: product.stock > 0,
          slug: product.sku || product.id,
        }));
        
        setProducts(formattedProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!session?.user?.id) return;
      
      try {
        const response = await fetch(`/api/wishlist?userId=${session.user.id}`);
        if (!response.ok) return;
        
        const data = await response.json();
        setWishlistItems(data.data?.items || []);
      } catch (error) {
        console.error('Failed to fetch wishlist items');
      }
    };
    
    if (session?.user?.id && products.length > 0) {
      fetchWishlist();
    }
  }, [session, products]);

  const getWishlistInfo = (productId: string) => {
    const wishlistItem = wishlistItems.find(item => item.productId === productId);
    return {
      isInWishlist: !!wishlistItem,
      wishlistItemId: wishlistItem?.id
    };
  };

  return (
    <div className="px-4 sm:px-8 md:px-12 lg:px-20 py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header with decorative elements */}
        <div className="text-center mb-12 relative">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            Featured Products
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Discover our handpicked selection of premium products
          </motion.p>
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"></div>
        </div>

        {/* Products grid */}
        {loading ? (
          <ProductListSkeleton />
        ) : error && products.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">Error loading featured products: {error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">No featured products available.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8"
          >
            {products.map((product) => {
              const { isInWishlist, wishlistItemId } = getWishlistInfo(product.id);
              return (
                <motion.div 
                  key={product.id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <Product 
                    product={product} 
                    isInWishlist={isInWishlist}
                    wishlistItemId={wishlistItemId}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* See All button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <button 
            onClick={() => router.push("/products?type=featured")}
            className="relative inline-flex items-center px-8 py-3 overflow-hidden text-lg font-medium text-white bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full group hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span className="relative z-10">View All Featured Products</span>
            <span className="absolute right-0 inline-flex items-center justify-center w-10 h-10 duration-300 transform translate-x-12 group-hover:translate-x-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-700 to-blue-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default FeaturedProducts;