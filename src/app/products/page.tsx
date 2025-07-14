"use client"
import HeaderBottom from '@/common/components/layouts/HeaderBottom'
import HeaderTop from '@/common/components/layouts/HeaderTop'
import Footer from '@/common/components/layouts/Footer'
import Products from '../../../modules/products'
import Navigation from '@/common/components/layouts/Navigation'
export default function CategoriesPage() {
    return (
        <main className="bg-white">
            <HeaderTop />
            <HeaderBottom />
            <Navigation/>
            <Products />
            <Footer />
        </main>
    )
}
