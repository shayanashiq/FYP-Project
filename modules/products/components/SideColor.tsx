"use client";

import React, { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';

// You might want to fetch these from an API later
const colors = [
  { id: 'black', name: 'Black', hex: '#000000' },
  { id: 'white', name: 'White', hex: '#FFFFFF' },
  { id: 'red', name: 'Red', hex: '#FF0000' },
  { id: 'blue', name: 'Blue', hex: '#0000FF' },
  { id: 'green', name: 'Green', hex: '#008000' },
  { id: 'yellow', name: 'Yellow', hex: '#FFFF00' },
  { id: 'purple', name: 'Purple', hex: '#800080' },
  { id: 'pink', name: 'Pink', hex: '#FFC0CB' }
];

const SideColor = () => {
  const [expanded, setExpanded] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const currentColor = searchParams.get('color') || '';
  
  const handleColorChange = (colorId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (colorId === currentColor) {
      // If clicking the same color, remove the filter
      params.delete('color');
    } else {
      // Otherwise set the new color
      params.set('color', colorId);
    }
    
    // Reset to page 1 when changing color
    params.set('page', '1');
    
    router.push(`${pathname}?${params.toString()}`);
  };
  
  return (
    <div className="py-4">
      <div 
        className="flex justify-between items-center cursor-pointer mb-3"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="font-medium text-sm uppercase">Color</h3>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>
      
      {expanded && (
        <div className="grid grid-cols-4 gap-2 mt-2">
          {colors.map((color) => (
            <div key={color.id} className="flex flex-col items-center">
              <button
                onClick={() => handleColorChange(color.id)}
                className={`w-8 h-8 rounded-full border ${
                  color.id === 'white' ? 'border-gray-300' : 'border-transparent'
                }`}
                style={{ backgroundColor: color.hex }}
                aria-label={color.name}
              >
                {currentColor === color.id && (
                  <Check 
                    size={16} 
                    className={`mx-auto ${
                      ['white', 'yellow'].includes(color.id) ? 'text-black' : 'text-white'
                    }`} 
                  />
                )}
              </button>
              <span className="text-xs mt-1">{color.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SideColor;