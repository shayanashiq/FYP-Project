'use client'

import React, { useState } from 'react'
import Button from '../elements/Button'
import InputField from '../elements/InputField'
import Image from 'next/image'
import { Search } from "lucide-react";

const SearchSection = () => {
    const [searchTerm, setSearchTerm] = useState("")

    return (
        <div className="w-full max-w-[650px] flex justify-center items-center gap-4 lg:flex md:flex">
            <div className="relative w-full">
                <InputField
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Controlled input
                    placeholder="Search products..."
                    className="text-black border border-gray-300 w-full h-12  bg-white rounded-md focus:outline-none focus:border-amber-600"
                />
                        <Search className="absolute cursor-pointer left-[610px] top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />

            </div>
        </div>
    )
}

export default SearchSection
