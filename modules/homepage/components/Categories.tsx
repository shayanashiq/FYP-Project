import React from 'react';

export const Categories = () => {
  const categoryData = [
    { id: 1, name: 'Electronics', icon: '💻' },
    { id: 2, name: 'Home & Kitchen', icon: '🏠' },
    { id: 3, name: 'Sports', icon: '⚽' },
    { id: 4, name: 'Health & Fitness', icon: '💪' },
    { id: 5, name: 'Fashion & Beauty', icon: '👗' },
  ];

  return (
    <div className="categories-container px-20 mt-20">
      <div className="grid grid-cols-5 gap-4 w-full">
        {categoryData.map((category) => (
          <div 
            key={category.id} 
            className="flex flex-col items-center justify-center p-4 border-2 rounded-full hover:bg-gray-100 transition-all cursor-pointer"
          >
            <span className="text-4xl mb-2">{category.icon}</span>
            <span className="text-center text-sm font-medium">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;