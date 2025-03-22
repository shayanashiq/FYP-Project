'use client'

import React from 'react'
import SearchSection from './SearchSection'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import CartSection from '@/common/components/layouts/CartSection'
import CategoryDropdown from './CategoryDropdown' // Make sure this path is correct
import logo from "@/assets/myImages/lylalora.png"

const HeaderBottom = () => {
    const router = useRouter();

    return (
        <header className="bg-[#205781] w-full top-4 left-0 z-50 shadow-md">
            <div className="container mx-auto flex items-center justify-between ">
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        router.push('/');
                    }}
                    className="flex-shrink-0"
                >
                    <Image
                        src={logo.src}
                        alt="Logo"
                        width={500}
                        height={500}
                        className="h-20 w-20"
                    />
                </a>

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