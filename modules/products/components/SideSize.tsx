"use client";

import React, { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';

// You might want to fetch these from an API later
const sizes = [
  { id: 'xs', name: 'XS' },
  { id: 's', name: 'S' },
  { id: 'm', name: 'M' },
  { id: 'l', name: 'L' },
  { id: 'xl', name: 'XL' },
  { id: 'xxl', name: 'XXL' }
];

export const SideSize = () => {
  const [expanded, setExpanded] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Get selected sizes as an array
  const selectedSizes = searchParams.get('size')?.split(',').filter(Boolean) || [];
  
  const handleSizeChange = (sizeId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Get current selected sizes
    const currentSizes = selectedSizes.slice();
    
    // If sizeId is already selected, remove it
    if (currentSizes.includes(sizeId)) {
      const updatedSizes = currentSizes.filter(id => id !== sizeId);
      
      if (updatedSizes.length === 0) {
        params.delete('size');
      } else {
        params.set('size', updatedSizes.join(','));
      }
    } else {
      // Otherwise add it to the selected sizes
      currentSizes.push(sizeId);
      params.set('size', currentSizes.join(','));
    }
    
    // Reset to page 1 when changing size
    params.set('page', '1');
    
    router.push(`${pathname}?${params.toString()}`);
  };
  
  return (
    <div className="py-4">
      <div 
        className="flex justify-between items-center cursor-pointer mb-3"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="font-medium text-sm uppercase">Size</h3>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>
      
      {expanded && (
        <div className="grid grid-cols-3 gap-2 mt-2">
          {sizes.map((size) => (
            <button
              key={size.id}
              onClick={() => handleSizeChange(size.id)}
              className={`border text-center py-2 text-sm rounded ${
                selectedSizes.includes(size.id) 
                  ? 'border-blue-600 bg-blue-50 text-blue-600' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {size.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};