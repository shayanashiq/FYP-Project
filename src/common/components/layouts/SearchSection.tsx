'use client'

import React, { useState } from 'react'
import { Search } from "lucide-react";

const SearchSection = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const handleSearch = (e: any) => {
    e.preventDefault()
    // Handle search logic here
    console.log("Searching for:", searchTerm)
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search products..."
          className={`w-full py-2 pl-4 px-4 pr-10 text-gray-700 bg-white border rounded-sm transition-all duration-200 focus:outline-none ${
            isFocused ? 'border-amber-500 shadow-sm' : 'border-gray-300'
          }`}
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-amber-600 transition-colors"
        >
          <Search size={18} />
        </button>
      </form>
    </div>
  );
};

export default SearchSection;