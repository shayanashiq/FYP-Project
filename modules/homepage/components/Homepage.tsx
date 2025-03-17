import React from 'react'
import Slider from './Slider'
import BannerPromotion from './BannerPromotion'
import TopSeller from './TopSeller'
import Features from './Features'
import Testimoni from './Testimoni'
import Partner from './Partner'
import FeaturedProducts from './FeaturedProducts'
import TopDeals from './TopDeals'

const Homepage = () => {
    return (
        <>
            <Slider />
            <FeaturedProducts/>
            <TopDeals/>
            <BannerPromotion />
            <TopSeller />
            <Features />
            <Testimoni />
            <Partner />
        </>
    )
}

export default Homepage