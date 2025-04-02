"use client";
import { SessionProvider } from "next-auth/react";
import type { Metadata } from "next";
import "@/assets/style/globals.css";
import { METADATA } from "../common/constant/metadata";
import { poppins } from "@/common/styles/fonts";
import CartSidebar from "@/components/CartSidebar";
import { CartProvider } from "@/components/context/CartContext";
import { useEffect } from "react";
import { useCart } from "@/components/context/CartContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <SessionProvider>
          <CartProvider>
            {children}
            <CartSidebar />
            <CartGlobalHandler />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

function CartGlobalHandler() {
  const { isCartOpen } = useCart();

  useEffect(() => {
    if (isCartOpen) {
      document.body.classList.add('cart-open');
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('cart-open');
      document.documentElement.style.overflow = '';
    }

    return () => {
      document.body.classList.remove('cart-open');
      document.documentElement.style.overflow = '';
    };
  }, [isCartOpen]);

  return null;
}