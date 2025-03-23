import React from 'react'
import Button from '@/common/components/elements/Button'

const BannerPromotion = () => {
    return (
        <div className="container mx-auto px-4">
            <div className="relative m-4 md:m-6 lg:m-10">
                {/* Responsive image */}
                <img 
                    className="w-full h-64 md:h-80 lg:h-96 xl:h-[450px] rounded-lg object-cover" 
                    src="/assets/img/pexels-nao-triponez-129208-1.png" 
                    alt="Laptop promotion"
                />
                
                {/* New laptop badge - responsive positioning */}
                <Button 
                    className="absolute top-4 right-4 md:top-8 md:right-8 lg:top-20 lg:right-16 xl:right-72 
                              w-24 md:w-28 lg:w-32 h-9 md:h-10 lg:h-11 
                              bg-amber-500 justify-center items-center 
                              text-white text-xs md:text-sm font-medium 
                              hover:bg-amber-600"
                >
                    New laptop
                </Button>
                
                {/* Sale text - responsive positioning and sizing */}
                <div className="absolute top-1/3 right-4 md:right-10 lg:right-20 xl:right-40 
                                w-64 md:w-72 lg:w-80 xl:w-96 
                                flex-col justify-center items-center gap-2 md:gap-3 flex">
                    <div className="text-cyan-600 text-2xl md:text-3xl lg:text-4xl font-bold text-center">
                        Sale up to 50% off
                    </div>
                    <div className="text-white text-sm md:text-base lg:text-lg font-medium text-center">
                        12 inch hd display
                    </div>
                </div>
                
                {/* Shop now button - responsive positioning */}
                <Button 
                    className="absolute bottom-4 right-4 md:bottom-8 md:right-8 lg:bottom-20 lg:right-16 xl:right-72 
                              w-24 md:w-28 lg:w-32 h-9 md:h-10 lg:h-11 
                              bg-amber-500 justify-center items-center 
                              text-white text-xs md:text-sm font-medium 
                              hover:bg-amber-600"
                >
                    Shop now
                </Button>
            </div>
        </div>
    )
}

export default BannerPromotion