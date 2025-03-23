"use client";

import React, { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';

// You might want to fetch these from an API later
const productTypes = [
  { id: 'new', name: 'New Arrivals' },
  { id: 'featured', name: 'Featured Products' },
  { id: 'bestseller', name: 'Best Sellers' },
  { id: 'sale', name: 'On Sale' }
];

const SideProductType = () => {
  const [expanded, setExpanded] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const currentType = searchParams.get('type') || '';
  
  const handleTypeChange = (typeId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (typeId === currentType) {
      // If clicking the same type, remove the filter
      params.delete('type');
    } else {
      // Otherwise set the new type
      params.set('type', typeId);
    }
    
    // Reset to page 1 when changing type
    params.set('page', '1');
    
    router.push(`${pathname}?${params.toString()}`);
  };
  
  return (
    <div className="py-4">
      <div 
        className="flex justify-between items-center cursor-pointer mb-3"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="font-medium text-sm uppercase">Product Type</h3>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>
      
      {expanded && (
        <div className="space-y-2 mt-2">
          {productTypes.map((type) => (
            <div key={type.id} className="flex items-center">
              <button
                onClick={() => handleTypeChange(type.id)}
                className={`text-sm hover:text-blue-600 w-full text-left py-1 ${
                  currentType === type.id ? 'font-medium text-blue-600' : 'text-gray-700'
                }`}
              >
                {type.name}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SideProductType;