'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, ChevronDown } from "lucide-react";
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  description?: string;
}

const SearchSection = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter();

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/products?${selectedCategory?.id ? `category=${selectedCategory.id}&` : ""}searchTerm=${searchTerm}`)
    console.log("Searching for:", searchTerm, "in category:", selectedCategory?.name || "All")
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  };

  // Mobile view
  const mobileView = (
    <div className="w-full md:hidden">
      <form onSubmit={handleSearch} className="relative flex flex-col">
        {/* Category Dropdown for Mobile */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={toggleDropdown}
            className={`flex items-center justify-between px-3 py-3 border rounded-t-sm text-gray-700 transition-all duration-200 ${
              isFocused ? 'border-amber-500' : 'border-gray-300'
            } ${
              selectedCategory ? 'text-gray-900 bg-gray-100' : 'text-gray-500 bg-white'
            }`}
          >
            <span className="mr-1 truncate">
              {selectedCategory ? selectedCategory.name : 'All Categories'}
            </span>
            <ChevronDown size={16} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap"
                >
                  All Categories
                </button>
                {isLoading ? (
                  <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
                ) : (
                  categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => selectCategory(category)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap"
                    >
                      {category.name}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Search Input for Mobile */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search products..."
            className={`w-full py-3 pl-4 pr-10 text-gray-700 bg-white border border-t-0 rounded-b-sm transition-all duration-200 focus:outline-none ${
              isFocused ? 'border-amber-500 shadow-sm' : 'border-gray-300'
            }`}
          />

          {/* Search Button */}
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-amber-600 transition-colors"
          >
            <Search size={18} />
          </button>
        </div>
      </form>
    </div>
  );

  // Desktop view - exactly as original
  const desktopView = (
    <div className="w-full hidden md:block">
      <form onSubmit={handleSearch} className="relative flex">
        {/* Category Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={toggleDropdown}
            className={`flex items-center justify-between px-3 py-3 border border-r-0 rounded-l-sm text-gray-700 transition-all duration-200 ${
              isFocused ? 'border-amber-500' : 'border-gray-300'
            } ${
              selectedCategory ? 'text-gray-900 bg-gray-100' : 'text-gray-500 bg-white'
            }`}
            style={{ minWidth: 'fit-content', maxWidth: '200px' }}
          >
            <span className="mr-1 whitespace-nowrap">
              {selectedCategory ? selectedCategory.name : 'All Categories'}
            </span>
            <ChevronDown size={16} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute z-10 w-auto min-w-48 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap"
                >
                  All Categories
                </button>
                {isLoading ? (
                  <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
                ) : (
                  categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => selectCategory(category)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap"
                    >
                      {category.name}
                    </button>
                  ))
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
          className={`flex-grow py-3 pl-4 px-4 pr-10 text-gray-700 bg-white border rounded-none rounded-r-sm transition-all duration-200 focus:outline-none ${
            isFocused ? 'border-amber-500 shadow-sm' : 'border-gray-300'
          }`}
        />

        {/* Search Button */}
        <button
          type="submit"
          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-amber-600 transition-colors"
        >
          <Search size={18} />
        </button>
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