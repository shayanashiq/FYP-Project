'use client'

import React, { useState } from 'react'
import SearchSection from './SearchSection'
import Link from 'next/link'
import CartSection from '@/common/components/layouts/CartSection'

// Categories with subcategories
const categoriesData = [
    {
        name: "Home and Kitchen",
        link: "/products/home-kitchen",
        subcategories: [
            { name: "Kitchenware", link: "/products/home-kitchen/kitchenware" },
            { name: "Furniture", link: "/products/home-kitchen/furniture" },
            { name: "Appliances", link: "/products/home-kitchen/appliances" },
            { name: "Bedding", link: "/products/home-kitchen/bedding" },
            { name: "Decor", link: "/products/home-kitchen/decor" }
        ]
    },
    {
        name: "Tools",
        link: "/products/tools",
        subcategories: [
            { name: "Power Tools", link: "/products/tools/power-tools" },
            { name: "Hand Tools", link: "/products/tools/hand-tools" },
            { name: "Tool Sets", link: "/products/tools/tool-sets" },
            { name: "Hardware", link: "/products/tools/hardware" },
            { name: "Gardening Tools", link: "/products/tools/gardening" }
        ]
    },
    {
        name: "Beauty and Skin Care",
        link: "/products/beauty-skin-care",
        subcategories: [
            { name: "Skincare", link: "/products/beauty-skin-care/skincare" },
            { name: "Makeup", link: "/products/beauty-skin-care/makeup" },
            { name: "Hair Care", link: "/products/beauty-skin-care/hair-care" },
            { name: "Fragrance", link: "/products/beauty-skin-care/fragrance" },
            { name: "Bath & Body", link: "/products/beauty-skin-care/bath-body" }
        ]
    },
    {
        name: "Health and Nutrition",
        link: "/products/health-nutrition",
        subcategories: [
            { name: "Vitamins", link: "/products/health-nutrition/vitamins" },
            { name: "Supplements", link: "/products/health-nutrition/supplements" },
            { name: "Protein", link: "/products/health-nutrition/protein" },
            { name: "Weight Management", link: "/products/health-nutrition/weight-management" },
            { name: "Wellness", link: "/products/health-nutrition/wellness" }
        ]
    },
    {
        name: "Sports",
        link: "/products/sports",
        subcategories: [
            { name: "Team Sports", link: "/products/sports/team-sports" },
            { name: "Outdoor Recreation", link: "/products/sports/outdoor-recreation" },
            { name: "Water Sports", link: "/products/sports/water-sports" },
            { name: "Sports Accessories", link: "/products/sports/accessories" },
            { name: "Fan Shop", link: "/products/sports/fan-shop" }
        ]
    },
    {
        name: "Fitness",
        link: "/products/fitness",
        subcategories: [
            { name: "Exercise Equipment", link: "/products/fitness/exercise-equipment" },
            { name: "Yoga & Pilates", link: "/products/fitness/yoga-pilates" },
            { name: "Fitness Accessories", link: "/products/fitness/accessories" },
            { name: "Activewear", link: "/products/fitness/activewear" },
            { name: "Fitness Trackers", link: "/products/fitness/trackers" }
        ]
    }
];

const CategoryDropdown = () => {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <button className="flex items-center gap-1 text-white font-medium hover:text-amber-300 transition-colors px-3 py-2">
                Categories
                <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 25 25" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transition-transform duration-300 ${isHovering ? 'rotate-180' : ''}`}
                >
                    <path 
                        d="M20.42 9.45001L13.9 15.97C13.13 16.74 11.87 16.74 11.1 15.97L4.58002 9.45001" 
                        stroke="currentColor" 
                        strokeWidth="1.5" 
                        strokeMiterlimit="10" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                    />
                </svg>
            </button>

            {isHovering && (
                <div className="absolute left-0 w-screen bg-white shadow-lg z-40 border-t border-gray-200" style={{ top: '100%' }}>
                    <div className="container mx-auto px-4 py-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                            {categoriesData.map((category, index) => (
                                <div key={index} className="flex flex-col">
                                    <Link
                                        href={category.link}
                                        className="font-semibold text-gray-800 hover:text-amber-500 mb-3 text-lg border-b border-gray-100 pb-2"
                                    >
                                        {category.name}
                                    </Link>
                                    <ul className="space-y-2">
                                        {category.subcategories.map((subcategory, subIndex) => (
                                            <li key={subIndex}>
                                                <Link
                                                    href={subcategory.link}
                                                    className="text-gray-600 hover:text-amber-500 text-sm block"
                                                >
                                                    {subcategory.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

const HeaderBottom = () => {
    return (
        <header className="bg-blue-800 w-full h-16 fixed top-0 left-0 z-50 shadow-md">
            <div className="container mx-auto h-full flex items-center justify-between px-4">
                <Link href="/" className="flex-shrink-0">
                    <img className="h-10" src="/assets/img/logo.png" alt="Logo" />
                </Link>
                
                <div className="flex-grow max-w-2xl mx-4">
                    <SearchSection />
                </div>
                
                <nav className="flex items-center gap-6">
                    <CategoryDropdown />
                    <CartSection />
                </nav>
            </div>
        </header>
    );
};

export default HeaderBottom;