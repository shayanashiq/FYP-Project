'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, ChevronDown, X } from "lucide-react";
import { useRouter, useSearchParams } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  description?: string;
}

const SearchSection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Parse URL params
  const currentSearchTerm = searchParams.get('search') || '';
  const currentCategoryIds = searchParams.get('categories')?.split(',').filter(Boolean) || [];
  
  const [searchTerm, setSearchTerm] = useState(currentSearchTerm);
  const [isFocused, setIsFocused] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
        
        // Populate selected categories from URL params
        if (currentCategoryIds.length > 0) {
          const selectedCats = data.filter(
            (cat: Category) => currentCategoryIds.includes(cat.id)
          );
          setSelectedCategories(selectedCats);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, [currentCategoryIds]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Check if search should be disabled
  // If more than one category is selected and search term is not empty
  const isSearchDisabled = selectedCategories.length > 1 && searchTerm.trim() !== '';
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSearchDisabled) {
      alert("Search is only available when 'All Categories' or a single category is selected");
      return;
    }
    
    // Build query parameters
    const params = new URLSearchParams();
    
    // Add search term if provided
    if (searchTerm.trim()) {
      params.set('search', searchTerm);
    }
    
    // Add categories if selected
    if (selectedCategories.length > 0) {
      const categoryIds = selectedCategories.map(cat => cat.id);
      params.set('categories', categoryIds.join(','));
    }
    
    // Maintain other existing query params that should be preserved
    // like pagination, sorting, etc.
    const currentParams = new URLSearchParams(searchParams.toString());
    
    ['page', 'sort', 'limit'].forEach(param => {
      if (currentParams.has(param)) {
        params.set(param, currentParams.get(param)!);
      }
    });
    
    // Reset to page 1 when searching
    params.set('page', '1');
    
    // Navigate to products page with search params
    router.push(`/products?${params.toString()}`);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleCategory = (category: Category) => {
    setSelectedCategories(prev => {
      // Check if category is already selected
      const isSelected = prev.some(cat => cat.id === category.id);
      
      if (isSelected) {
        // Remove category
        return prev.filter(cat => cat.id !== category.id);
      } else {
        // Add category
        return [...prev, category];
      }
    });
    
    // Don't close dropdown after selection to allow selecting multiple categories
  };
  
  const clearAllCategories = () => {
    setSelectedCategories([]);
  };
  
  const removeCategory = (categoryId: string) => {
    setSelectedCategories(prev => prev.filter(cat => cat.id !== categoryId));
  };
  
  // Selected categories display - used in both mobile and desktop views
  const selectedCategoriesChips = (
    <div className="flex flex-wrap gap-2 mt-2">
      {selectedCategories.map((cat) => (
        <div 
          key={cat.id}
          className="flex items-center bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs"
        >
          <span className="mr-1">{cat.name}</span>
          <button 
            type="button"
            onClick={() => removeCategory(cat.id)}
            className="text-amber-600 hover:text-amber-800"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      {selectedCategories.length > 0 && (
        <button
          type="button"
          onClick={clearAllCategories}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Clear all
        </button>
      )}
    </div>
  );

  // Mobile view
  const mobileView = (
    <div className="w-full md:hidden">
      <form onSubmit={handleSearch} className="relative flex flex-col">
        {/* Search Input for Mobile */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search products..."
            className={`w-full py-3 pl-4 pr-10 text-gray-700 bg-white border rounded-t-sm transition-all duration-200 focus:outline-none ${
              isFocused ? 'border-amber-500 shadow-sm' : 'border-gray-300'
            } ${
              isSearchDisabled ? 'bg-gray-100' : ''
            }`}
            disabled={isSearchDisabled}
          />

          {/* Search Button */}
          <button
            type="submit"
            className={`absolute inset-y-0 right-0 flex items-center px-3 transition-colors ${
              isSearchDisabled ? 'text-gray-400' : 'text-gray-500 hover:text-amber-600'
            }`}
            disabled={isSearchDisabled}
          >
            <Search size={18} />
          </button>
        </div>
        
        {/* Category Dropdown for Mobile */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={toggleDropdown}
            className={`w-full flex items-center justify-between px-3 py-3 border border-t-0 rounded-b-sm text-gray-700 transition-all duration-200 ${
              isFocused ? 'border-amber-500' : 'border-gray-300'
            } ${
              selectedCategories.length > 0 ? 'text-gray-900 bg-gray-100' : 'text-gray-500 bg-white'
            }`}
          >
            <span className="mr-1 truncate">
              {selectedCategories.length === 0 
                ? 'All Categories' 
                : selectedCategories.length === 1 
                  ? selectedCategories[0].name 
                  : `${selectedCategories.length} categories selected`}
            </span>
            <ChevronDown size={16} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              <div className="py-1">
                {isLoading ? (
                  <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
                ) : (
                  categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <input
                        type="checkbox"
                        id={`mobile-cat-${category.id}`}
                        checked={selectedCategories.some(cat => cat.id === category.id)}
                        onChange={() => toggleCategory(category)}
                        className="mr-2"
                      />
                      <label 
                        htmlFor={`mobile-cat-${category.id}`}
                        className="flex-grow cursor-pointer"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Warning message for search with multiple categories */}
        {selectedCategories.length > 1 && searchTerm.trim() !== '' && (
          <div className="mt-2 text-xs text-red-500">
            Search is only available when "All Categories" or a single category is selected
          </div>
        )}
        
        {/* Selected categories chips */}
        {selectedCategoriesChips}
      </form>
    </div>
  );

  // Desktop view 
  const desktopView = (
    <div className="w-full hidden md:block">
      <form onSubmit={handleSearch} className="relative">
        <div className="flex">
          {/* Category Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={toggleDropdown}
              className={`flex items-center justify-between px-3 py-3 border border-r-0 rounded-l-sm text-gray-700 transition-all duration-200 ${
                isFocused ? 'border-amber-500' : 'border-gray-300'
              } ${
                selectedCategories.length > 0 ? 'text-gray-900 bg-gray-100' : 'text-gray-500 bg-white'
              }`}
              style={{ minWidth: '150px' }}
            >
              <span className="mr-1 truncate">
                {selectedCategories.length === 0 
                  ? 'All Categories' 
                  : selectedCategories.length === 1 
                    ? selectedCategories[0].name 
                    : `${selectedCategories.length} categories`}
              </span>
              <ChevronDown size={16} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute z-10 w-64 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                <div className="py-1">
                  {isLoading ? (
                    <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
                  ) : (
                    <>
                      <div
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b"
                      >
                        <button
                          type="button"
                          onClick={clearAllCategories}
                          className="w-full text-left"
                        >
                          All Categories
                        </button>
                      </div>
                      {categories.map((category) => (
                        <div
                          key={category.id}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <input
                            type="checkbox"
                            id={`desktop-cat-${category.id}`}
                            checked={selectedCategories.some(cat => cat.id === category.id)}
                            onChange={() => toggleCategory(category)}
                            className="mr-2"
                          />
                          <label 
                            htmlFor={`desktop-cat-${category.id}`}
                            className="flex-grow cursor-pointer"
                          >
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Search Input */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search products..."
            className={`flex-grow py-3 pl-4 pr-10 text-gray-700 bg-white border rounded-none rounded-r-sm transition-all duration-200 focus:outline-none ${
              isFocused ? 'border-amber-500 shadow-sm' : 'border-gray-300'
            } ${
              isSearchDisabled ? 'bg-gray-100' : ''
            }`}
            disabled={isSearchDisabled}
          />

          {/* Search Button */}
          <button
            type="submit"
            className={`absolute inset-y-0 right-0 flex items-center px-3 transition-colors ${
              isSearchDisabled ? 'text-gray-400' : 'text-gray-500 hover:text-amber-600'
            }`}
            disabled={isSearchDisabled}
          >
            <Search size={18} />
          </button>
        </div>
        
        {/* Warning message for search with multiple categories */}
        {selectedCategories.length > 1 && searchTerm.trim() !== '' && (
          <div className="mt-2 text-xs text-red-500">
            Search is only available when "All Categories" or a single category is selected
          </div>
        )}
        
        {/* Selected categories chips */}
        {selectedCategoriesChips}
      </form>
    </div>
  );

  return (
    <>
      {mobileView}
      {desktopView}
    </>
  );
};

export default SearchSection;