import React from 'react'
import SideCategories from './SideCategories'
import { Separator } from '@/common/components/elements/Separator'
import SideProductType from './SideProductType'
import SideColor from './SideColor'
import { SideSize } from './SideSize'
import { Card } from '@/common/components/elements/Card'
import ButtonLove from '@/common/components/elements/ButtonLove'
import Star from '@/common/components/elements/Star'
import { PRODUCTS } from '@/common/constant/products'
import BannerPromotion from '../../homepage/components/BannerPromotion'
import Link from 'next/link'
import Product from '../../../modules/homepage/components/Product'

const Products = () => {
    return (
        <>
            <div className="mx-auto min-h-full container mt-4 p-8 flex md:p-4">
                <div className="w-[300px] h-full hidden lg:block">
                    <SideCategories />
                    <Separator />
                    <Separator />
                    <SideProductType />
                    <Separator />
                    <Separator />
                    <SideColor />
                    <Separator />
                    <SideSize />
                    <Separator />
                </div>
                <div className="max-w-full ml-8 flex flex-wrap ">
                    {PRODUCTS.map((product, index) => (
                        <Product key={`${product.id}-${index}`} product={product} />

                    ))}
                </div>
            </div>
            <BannerPromotion />
        </>
    )
}

export default Products