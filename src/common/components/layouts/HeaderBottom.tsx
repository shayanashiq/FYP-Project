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
            className="relative bg-blue-900"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div className="space-x-2 h-16  flex items-center justify-center cursor-pointer">
                <div className="text-[#000000] font-medium text-base whitespace-nowrap">Categories</div>
                <svg width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.42 9.45001L13.9 15.97C13.13 16.74 11.87 16.74 11.1 15.97L4.58002 9.45001" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            {isHovering && (
                <div className="fixed inset-0 h-[300px] flex items-center justify-center bg-white shadow-lg py-8 z-100  shadow-3xl border-t border-gray-200" style={{ top: '7rem' }}>
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-6 gap-8">
                            {categoriesData.map((category, index) => (
                                <div key={index}>
                                    <Link
                                        href={category.link}
                                        className="font-semibold text-gray-800 hover:text-amber-500 mb-4 block text-lg"
                                    >
                                        {category.name}
                                    </Link>
                                    <ul>
                                        {category.subcategories.map((subcategory, subIndex) => (
                                            <li key={subIndex} className="mb-2">
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
        <div className="bg-[#7D0A0A] w-full h-16 px-4 flex items-center gap-10 fixed top-0 left-0">
            <Link href="/" className="cursor-pointer">
                <img className="ml-16" src="/assets/img/logo.png" alt="Logo" />
            </Link>
            <SearchSection />
            <CategoryDropdown />
            <CartSection />
        </div>
    );
};

export default HeaderBottom;
