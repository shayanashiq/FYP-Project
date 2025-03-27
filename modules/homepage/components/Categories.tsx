import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Define the type for categories based on your Prisma schema
interface Category {
  id: number;
  name: string;
  description?: string;
  subcategories?: Subcategory[];
}

interface Subcategory {
  id: number;
  name: string;
  categoryId: number;
}

export const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/categories');
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        setCategories(data);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fallback emoji for categories without specific icons
  const getDefaultIcon = (categoryName: string) => {
    const iconMap: { [key: string]: string } = {
      'Electronics': '💻',
      'Home & Kitchen': '🏠',
      'Sports': '⚽',
      'Health & Fitness': '💪',
      'Fashion & Beauty': '👗'
    };
    return iconMap[categoryName] || '📦';
  };

  if (isLoading) {
    return (
      <div className="categories-container px-20 mt-20">
        <div className="text-center text-gray-500">Loading categories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="categories-container px-20 mt-20">
        <div className="text-center text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="categories-container px-20 mt-20">
      <div className="grid grid-cols-5 gap-4 w-full">
        {categories.map((category) => (
          <div 
          onClick={()=>router.push(`/products?category=${category.id}`)}
            key={category.id} 
            className="flex flex-col items-center justify-center p-4 border-2 rounded-full hover:bg-gray-100 transition-all cursor-pointer"
          >
            <span className="text-4xl mb-2">
              {getDefaultIcon(category.name)}
            </span>
            <span className="text-center text-sm font-medium">
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;