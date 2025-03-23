'use client'

import React, { useState, useEffect } from 'react'
import SideCategories from './SideCategories'
import { Separator } from '@/common/components/elements/Separator'
import SideProductType from './SideProductType'
import { SideSize } from './SideSize'
import SidePriceRange from './SidePriceRange'
import BannerPromotion from '../../homepage/components/BannerPromotion'
import { useSearchParams, useRouter } from 'next/navigation'
import ProductGrid from './ProductGrid'
import ProductListSkeleton from './ProductListSkeleton'
import Pagination from '@/common/components/Pagination'
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react'
import SortDropdown from '@/common/components/SortDropdown'
import NoResults from '@/common/components/NoResults'

interface Product {
  id: string;
  name: string;
  price: number;
  discount?: number;
  images: string[];
  avgRating: number;
  reviewCount: number;
  description: string;
  shortDescription: string;
  category?: {
    id: string;
    name: string;
  };
  subcategory?: {
    id: string;
    name: string;
  };
  vendor?: {
    id: string;
    name: string;
  };
}

// Chip component for filters
const Chip = ({ label, onRemove }: { label: string; onRemove: () => void }) => {
  return (
    <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
      <span>{label}</span>
      <button onClick={onRemove} className="ml-2">
        <X size={14} />
      </button>
    </div>
  );
};

const Products = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  
  // Get current query parameters - ensure correct naming
  const search = searchParams.get('searchTerm') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const pageParam = searchParams.get('page') || '1';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const color = searchParams.get('color') || '';
  const size = searchParams.get('size') || '';
  const type = searchParams.get('type') || '';
  
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setDebugInfo(null);
      
      // Debug the parameters being sent
      console.log('Frontend parameters:', {
        searchTerm: search,
        category: category,
        sort,
        page: pageParam,
        minPrice,
        maxPrice,
        color,
        size,
        type
      });
      
      // Build query URL with correctly named parameters
      const queryParams = new URLSearchParams();
      if (search) queryParams.set('search', search);
      if (category) queryParams.set('category', category); // Critical: use "category" not "categories"
      if (sort) queryParams.set('sort', sort);
      if (pageParam) queryParams.set('page', pageParam);
      if (minPrice) queryParams.set('minPrice', minPrice);
      if (maxPrice) queryParams.set('maxPrice', maxPrice);
      if (color) queryParams.set('color', color);
      if (size) queryParams.set('size', size);
      if (type) queryParams.set('type', type);
      
      
      try {
        const response = await fetch(`/api/products/search?${queryParams.toString()}`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch products: ${errorText}`);
        }
        
        const data = await response.json();
        
        // Debug the returned data
        console.log(`Received ${data.products.length} products from API`);
        if (category && data.products.length > 0) {
          // Check if all products have the correct category
          const wrongCategoryProducts = data.products.filter(p => p.category?.id !== category);
          if (wrongCategoryProducts.length > 0) {
            console.warn(`Found ${wrongCategoryProducts.length} products with wrong category!`);
            setDebugInfo(`Warning: ${wrongCategoryProducts.length} products don't match the selected category!`);
          }
        }
        
        setProducts(data.products);
        setTotalPages(data.pagination.totalPages);
        setCurrentPage(data.pagination.page);
        setTotalCount(data.pagination.total);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        setDebugInfo(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [search, category, sort, pageParam, minPrice, maxPrice, color, size, type]);
  
  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`?${params.toString()}`);
  };

  // Clear all filters
  const clearAllFilters = () => {
    const params = new URLSearchParams();
    if (search) params.set('searchTerm', search);
    router.push(`?${params.toString()}`);
  };

  // Check if any filters are applied
  const hasFilters = category || minPrice || maxPrice || color || size || type;

  return (
    <>
      <div className="mx-auto min-h-full container p-4 md:p-6">
        {/* Debug information - Remove in production */}
        {debugInfo && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
            <p className="font-bold">Debug Info:</p>
            <p>{debugInfo}</p>
          </div>
        )}
       
        {/* Mobile filters button */}
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <button
            onClick={toggleFilters}
            className="flex items-center gap-2 text-sm bg-white border border-gray-300 rounded-md px-3 py-2"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
          
          <SortDropdown />
        </div>
        
        {/* Main content area */}
        <div className="flex relative">
          {/* Sidebar filters - desktop */}
          <div className="w-[250px] h-full hidden lg:block pr-6">
            <div className="sticky top-4">
              {/* Clear filters button */}
              {hasFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 mb-4 flex items-center"
                >
                  <X size={16} className="mr-1" />
                  Clear all filters
                </button>
              )}
              
              <SideCategories />
              <Separator />
              <SideProductType />
              <Separator />
              <SidePriceRange />
              <Separator />
              <SideSize />
              <Separator />
            </div>
          </div>
          
          {/* Mobile filters sidebar */}
          {isFiltersOpen && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden">
              <div className="absolute right-0 top-0 h-full w-[280px] bg-white overflow-y-auto p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg">Filters</h3>
                  <button onClick={toggleFilters} className="text-gray-500">
                    <X size={20} />
                  </button>
                </div>
                
                {/* Clear filters button */}
                {hasFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 mb-4 flex items-center"
                  >
                    <X size={16} className="mr-1" />
                    Clear all filters
                  </button>
                )}
                
                <SideCategories />
                <Separator />
                <SideProductType />
                <Separator />
                <SidePriceRange />
                <Separator />
                <Separator />
                <SideSize />
              </div>
            </div>
          )}
          
          {/* Product listing area */}
          <div className="flex-1">
            {/* Applied filters chips - mobile and desktop */}
            <div className="flex flex-wrap gap-2 mb-4">
              {category && (
                <Chip 
                  label={`Categories: ${
                    category.split(',').length > 1 
                      ? `${category.split(',').length} selected` 
                      : category
                  }`}
                  onRemove={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete('category');
                    router.push(`?${params.toString()}`);
                  }}
                />
              )}
              
              {type && (
                <Chip 
                  label={`Types: ${
                    type.split(',').length > 1 
                      ? `${type.split(',').length} selected` 
                      : type
                  }`}
                  onRemove={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete('type');
                    router.push(`?${params.toString()}`);
                  }}
                />
              )}
              
              {size && (
                <Chip 
                  label={`Sizes: ${
                    size.split(',').length > 1 
                      ? `${size.split(',').length} selected` 
                      : size.toUpperCase()
                  }`}
                  onRemove={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete('size');
                    router.push(`?${params.toString()}`);
                  }}
                />
              )}
              
              {minPrice && maxPrice && (
                <Chip 
                  label={`Price: $${minPrice} - $${maxPrice}`}
                  onRemove={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete('minPrice');
                    params.delete('maxPrice');
                    router.push(`?${params.toString()}`);
                  }}
                />
              )}
              
              {minPrice && !maxPrice && (
                <Chip 
                  label={`Price: $${minPrice}+`}
                  onRemove={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete('minPrice');
                    router.push(`?${params.toString()}`);
                  }}
                />
              )}
              
              {!minPrice && maxPrice && (
                <Chip 
                  label={`Price: Up to $${maxPrice}`}
                  onRemove={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete('maxPrice');
                    router.push(`?${params.toString()}`);
                  }}
                />
              )}
              
              {color && (
                <Chip 
                  label={`Color: ${color}`}
                  onRemove={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete('color');
                    router.push(`?${params.toString()}`);
                  }}
                />
              )}
            </div>
            
            {/* Sort dropdown - desktop */}
            <div className="hidden lg:flex justify-between items-center mb-4">
              <div className="text-sm text-gray-500">
                Showing {totalCount} {totalCount === 1 ? 'product' : 'products'}
              </div>
              <SortDropdown />
            </div>
            
            {/* Products grid or no results */}
            {loading ? (
              <ProductListSkeleton />
            ) : products.length > 0 ? (
              <>
                <ProductGrid products={products} />
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination 
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            ) : (
              <NoResults 
                title="No products found"
                description="Try changing your search or filter criteria."
              />
            )}
          </div>
        </div>
        
        {/* Promotional banner at bottom */}
        <div className="mt-12">
          <BannerPromotion />
        </div>
      </div>
    </>
  );
};

export default Products;