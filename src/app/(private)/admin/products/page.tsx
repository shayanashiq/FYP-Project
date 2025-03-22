'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SearchBar from '../../../../../modules/admin/components/searchbar';
import ProductTable from '../../../../../modules/admin/components/productTable';
import { searchProducts } from '@/lib/search';
import { Plus } from 'lucide-react';
import { Prisma } from '@prisma/client';

import type { Product as ProductTableProduct } from '../../../../../modules/admin/components/productTable';

// Updated interface to match actual API response
interface ApiProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  sku: string;
  images: string[];
  isFeatured: boolean;
  isBestChoice: boolean;
  discount: number;
  color: string[];
  size: string[];
  shortDescription: string;
  category?: { 
    id: string; 
    name: string; 
  } | null;
  vendor?: { 
    id: string; 
    email: string;
    customerProfile?: {
      firstName: string;
      lastName: string;
    } | null;
  } | null;
  avgRating: number;
  reviewCount: number;
  createdAt?: string;
  updatedAt?: string;
}

// Define search compatible product interface
interface SearchProduct {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  color: string[];
  size: string[];
  price: Prisma.Decimal;
  discount?: Prisma.Decimal | null;
  isFeatured: boolean;
  isBestChoice: boolean;
  stock: number;
  sku: string;
  images: string[];
  categoryId?: string | null;
  category?: {
    id: string;
    name: string;
  } | null;
  vendorId?: string | null;
  vendor?: {
    id: string;
    email: string;
    customerProfile?: {
      firstName: string;
      lastName: string;
    } | null;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

// Define pagination type
type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export default function ProductsPage() {
  const [apiProducts, setApiProducts] = useState<ApiProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductTableProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Improved mapper function to handle potential undefined values
  const mapApiProductsToTableProducts = (products: ApiProduct[]): ProductTableProduct[] => {
    return products.map(product => {
      // Debug statement to see what's coming from the API
      console.log('Mapping product:', product);
      
      return {
        id: product.id || '',
        name: product.name || '',
        price: typeof product.price === 'number' ? product.price : 0,
        category: product.category?.name || '',
        stock: typeof product.stock === 'number' ? product.stock : 0,
        // Ensure createdAt is a string as expected by ProductTable
        createdAt: product.createdAt || new Date().toISOString(),
        isFeatured: !!product.isFeatured,
        isBestChoice: !!product.isBestChoice
      };
    });
  };

  // Adapter function to convert ApiProduct to SearchProduct for search compatibility
  const adaptApiProductsForSearch = (products: ApiProduct[]): SearchProduct[] => {
    return products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description || '',
      shortDescription: product.shortDescription || (product.description ? product.description.substring(0, 100) + '...' : ''),
      color: Array.isArray(product.color) ? product.color : [],
      size: Array.isArray(product.size) ? product.size : [],
      price: new Prisma.Decimal(product.price || 0),
      discount: product.discount !== undefined ? new Prisma.Decimal(product.discount) : null,
      isFeatured: !!product.isFeatured,
      isBestChoice: !!product.isBestChoice,
      stock: product.stock || 0,
      sku: product.sku || '',
      images: Array.isArray(product.images) ? product.images : [],
      categoryId: product.category?.id,
      category: product.category,
      vendorId: product.vendor?.id,
      vendor: product.vendor,
      createdAt: product.createdAt ? new Date(product.createdAt) : new Date(),
      updatedAt: product.updatedAt ? new Date(product.updatedAt) : new Date()
    }));
  };

  // Add this adapter function to map vendor data correctly for the search function
  const adaptProductsForSearchFunction = (products: SearchProduct[]) => {
    return products.map(product => ({
      ...product,
      vendor: product.vendor ? {
        id: product.vendor.id,
        // Create a name field from available vendor data
        name: product.vendor.customerProfile 
          ? `${product.vendor.customerProfile.firstName} ${product.vendor.customerProfile.lastName}`.trim() 
          : product.vendor.email
      } : null
    }));
  };

  // Fetch products from API
  const fetchProducts = async (page = 1, limit = 10, search = '') => {
    setIsLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      if (search) {
        params.append('search', search);
      }

      const url = `/api/products?${params.toString()}`;
      console.log('Fetching products from:', url);
      
      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API response data:', data);
      
      if (!data.products || !Array.isArray(data.products)) {
        console.error('Invalid API response format:', data);
        throw new Error('Invalid API response format');
      }

      const apiProductData = data.products as ApiProduct[];
      setApiProducts(apiProductData);

      // Convert the API response to the format expected by ProductTable
      const tableProducts = mapApiProductsToTableProducts(apiProductData);
      setFilteredProducts(tableProducts);

      setPagination(data.pagination || {
        total: apiProductData.length,
        page: 1,
        limit: 10,
        totalPages: 1
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.length > 2) {
      // Use API search for longer queries
      fetchProducts(1, pagination.limit, query);
    } else if (query === '') {
      // Reset to first page when search is cleared
      fetchProducts(1, pagination.limit);
    } else if (apiProducts.length > 0) {
      // For short queries (1-2 chars), filter client-side
      // Convert ApiProducts to Products for searching
      const adaptedProducts = adaptApiProductsForSearch(apiProducts);
      
      // Perform search with properly adapted products
      const searchResults = searchProducts(adaptProductsForSearchFunction(adaptedProducts), query);
      
      // Map search results back to table format
      const matchedApiProducts = apiProducts.filter(apiProduct => 
        searchResults.some(result => result.id === apiProduct.id)
      );
      
      // Convert to table format
      const tableProducts = mapApiProductsToTableProducts(matchedApiProducts);
      setFilteredProducts(tableProducts);
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchProducts(newPage, pagination.limit, searchQuery);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");

    if (confirmDelete) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete product');
        }

        // Refresh the product list after deletion
        fetchProducts(pagination.page, pagination.limit, searchQuery);
        
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/admin/products/add"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus size={18} className="mr-2" />
          Add Product
        </Link>
      </div>

      <div className="w-full">
        <SearchBar onSearch={handleSearch} placeholder="Search products by name, description..." />
      </div>

      {isLoading ? (
        <div className="text-center py-6">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
          <p className="mt-2 text-gray-600">Loading products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No products found</p>
        </div>
      ) : (
        <>
          <ProductTable
            products={filteredProducts}
            onDelete={handleDelete}
          />

          {/* Pagination controls */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 rounded border disabled:opacity-50"
                >
                  Previous
                </button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(page =>
                    page === 1 ||
                    page === pagination.totalPages ||
                    (page >= pagination.page - 1 && page <= pagination.page + 1)
                  )
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-2">...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 rounded-full ${pagination.page === page
                          ? 'bg-blue-600 text-white'
                          : 'border hover:bg-gray-100'
                          }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  ))}

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-1 rounded border disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}