import React from 'react';
import { Card } from '@/common/components/elements/Card';

interface ProductListSkeletonProps {
  count?: number;
}

const ProductListSkeleton: React.FC<ProductListSkeletonProps> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <div className="relative h-48 bg-gray-200 animate-pulse"></div>
          <div className="p-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ProductListSkeleton;