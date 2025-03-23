import React from 'react'
import Slider from './Slider'
import BannerPromotion from './BannerPromotion'
import TopSeller from './TopSeller'
import Features from './Features'
import Partner from './Partner'
import FeaturedProducts from './FeaturedProducts'
import TopDeals from './TopDeals'
import Newsletter from '@/common/components/layouts/Newsletter'

const Homepage = () => {
    return (
        <>
            <Slider />
            <FeaturedProducts/>
            <TopDeals/>
            <BannerPromotion />
            <TopSeller />
            <Features />
        </>
    )
}

export default Homepage