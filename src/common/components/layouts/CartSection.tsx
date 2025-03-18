'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react' // Import useSession hook

const CartSection = () => {
    const router = useRouter();
    const { data: session } = useSession(); // Get session data
    
    const navItems = [
        {
            name: session ? "Account" : "Sign in",
            icon: (
                <svg width="20" height="20" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.7894 12C15.5509 12 17.7894 9.76142 17.7894 7C17.7894 4.23858 15.5509 2 12.7894 2C10.028 2 7.78943 4.23858 7.78943 7C7.78943 9.76142 10.028 12 12.7894 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21.3794 22C21.3794 18.13 17.5294 15 12.7894 15C8.04943 15 4.19943 18.13 4.19943 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            onClick: () => router.push(session ? "/account" : "/login"),
            count: null
        },
        {
            name: session ? "Wishlist" : "Sign in",
            icon: (
                <svg width="20" height="20" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.4094 20.81C13.0694 20.93 12.5094 20.93 12.1694 20.81C9.26943 19.82 2.78943 15.69 2.78943 8.69001C2.78943 5.60001 5.27943 3.10001 8.34943 3.10001C10.1694 3.10001 11.7794 3.98001 12.7894 5.34001C13.7994 3.98001 15.4194 3.10001 17.2294 3.10001C20.2994 3.10001 22.7894 5.60001 22.7894 8.69001C22.7894 15.69 16.3094 19.82 13.4094 20.81Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            ),
            onClick: () => router.push(session ? "/account/wishlist" : "/login"),
            count: 0
        },
        
        {
            name: "Cart",
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.99995 2H3.73996C4.81996 2 5.66996 2.93 5.57996 4L4.74995 13.96C4.60995 15.59 5.89995 16.99 7.53995 16.99H18.19C19.63 16.99 20.89 15.81 21 14.38L21.5399 6.88C21.6599 5.22 20.3999 3.87 18.7299 3.87H5.81996" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16.25 22C16.9403 22 17.5 21.4404 17.5 20.75C17.5 20.0596 16.9403 19.5 16.25 19.5C15.5596 19.5 15 20.0596 15 20.75C15 21.4404 15.5596 22 16.25 22Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8.24995 22C8.94031 22 9.49995 21.4404 9.49995 20.75C9.49995 20.0596 8.94031 19.5 8.24995 19.5C7.5596 19.5 6.99995 20.0596 6.99995 20.75C6.99995 21.4404 7.5596 22 8.24995 22Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8.99995 8H21" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            onClick: () => router.push("/account/cart"),
            count: 0
        }
    ];

    return (
        <nav className="flex items-center justify-end space-x-2">
            {navItems.map((item, index) => (
                <button
                    key={index}
                    onClick={item.onClick}
                    className="flex items-center gap-2 px-3 py-2 text-white rounded-lg transition-colors hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
                >
                    <div className="relative">
                        <div className="text-white">{item.icon}</div>
                        {item.count !== null && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-medium">{item.count}</span>
                            </div>
                        )}
                    </div>
                    <span className="text-sm font-medium hidden sm:block">{item.name}</span>
                </button>
            ))}
        </nav>
    );
};

export default CartSection;