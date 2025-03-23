"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  count?: number;
}

const SideCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const currentCategory = searchParams.get('category') || '';
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (categoryId === currentCategory) {
      // If clicking the same category, remove the filter
      params.delete('category');
    } else {
      // Otherwise set the new category
      params.set('category', categoryId);
    }
    
    // Reset to page 1 when changing category
    params.set('page', '1');
    
    router.push(`${pathname}?${params.toString()}`);
  };
  
  return (
    <div className="py-4">
      <div 
        className="flex justify-between items-center cursor-pointer mb-3"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="font-medium text-sm uppercase">Categories</h3>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>
      
      {expanded && (
        <div className="space-y-2 mt-2">
          {loading ? (
            <div className="animate-pulse">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-5 bg-gray-200 rounded my-2 w-3/4"></div>
              ))}
            </div>
          ) : (
            categories.map((category) => (
              <div key={category.id} className="flex items-center">
                <button
                  onClick={() => handleCategoryChange(category.id)}
                  className={`text-sm hover:text-blue-600 flex justify-between w-full py-1 ${
                    currentCategory === category.id ? 'font-medium text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <span>{category.name}</span>
                  {category.count !== undefined && (
                    <span className="text-gray-500 text-xs">({category.count})</span>
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SideCategories;