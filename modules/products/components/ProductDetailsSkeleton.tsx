import React from 'react';
import { Separator } from '@/common/components/elements/Separator';
import { Card } from '@/common/components/elements/Card';

const ProductSkeleton = () => {
    return (
        <div className='container mx-auto'>
            <div className='min-h-full flex flex-col lg:flex-row py-14'>
                {/* Left side - Image gallery skeleton */}
                <div className="w-full lg:w-1/2 h-full justify-center items-center gap-5 flex flex-col">
                    {/* Main image skeleton */}
                    <div className="w-full rounded-md max-w-[500px] h-96 relative overflow-hidden bg-gray-200 animate-pulse">
                    </div>

                    {/* Thumbnail images skeleton */}
                    <div className="flex m-auto flex-wrap gap-5 group">
                        {[...Array(4)].map((_, index) => (
                            <div
                                key={index}
                                className="w-28 h-28 md:w-36 md:h-32 bg-gray-200 animate-pulse"
                            ></div>
                        ))}
                    </div>
                </div>

                {/* Right side - Product details skeleton */}
                <div className="w-full lg:w-1/2 h-full lg:h-auto lg:flex lg:ml-5">
                    <div className="w-full max-w-[500px] h-full lg:h-auto lg:w-full flex-col gap-2 flex mt-10 lg:mt-0 mx-auto px-4 lg:px-0">
                        {/* Product name skeleton */}
                        <div className="h-8 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>

                        {/* Price skeleton */}
                        <div className="flex items-center gap-3 mt-2">
                            <div className="h-7 bg-gray-200 rounded-md w-24 animate-pulse"></div>
                            <div className="h-7 bg-gray-200 rounded-md w-24 animate-pulse"></div>
                        </div>

                        {/* Ratings skeleton */}
                        <div className="flex items-center gap-2.5 mt-2">
                            <div className="h-5 bg-gray-200 rounded-md w-32 animate-pulse"></div>
                        </div>

                        {/* Availability skeleton */}
                        <div className="flex gap-5 mt-2">
                            <div className="h-6 bg-gray-200 rounded-md w-24 animate-pulse"></div>
                            <div className="h-6 bg-gray-200 rounded-md w-20 animate-pulse"></div>
                        </div>

                        {/* Stock notification skeleton */}
                        <div className="h-6 bg-gray-200 rounded-md w-64 animate-pulse mt-1"></div>

                        <Separator />

                        {/* Color options skeleton */}
                        <div className="flex items-center mt-2">
                            <div className="h-6 bg-gray-200 rounded-md w-16 animate-pulse"></div>
                            <div className="flex gap-2 ml-3">
                                {[...Array(4)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="w-4 h-4 rounded-full bg-gray-300 animate-pulse"
                                    ></div>
                                ))}
                            </div>
                        </div>

                        {/* Size options skeleton */}
                        <div className="flex items-center mt-2">
                            <div className="h-6 bg-gray-200 rounded-md w-16 animate-pulse"></div>
                            <div className="flex gap-2 ml-3 flex-wrap">
                                {[...Array(3)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="w-16 h-8 bg-gray-200 animate-pulse"
                                    ></div>
                                ))}
                            </div>
                        </div>

                        {/* Quantity selector skeleton */}
                        <div className="flex items-center mt-2">
                            <div className="h-6 bg-gray-200 rounded-md w-20 animate-pulse"></div>
                            <div className="flex gap-0 ml-3">
                                <div className="w-10 h-8 bg-gray-200 animate-pulse"></div>
                                <div className="w-14 h-8 bg-gray-200 animate-pulse"></div>
                                <div className="w-10 h-8 bg-gray-200 animate-pulse"></div>
                            </div>
                        </div>

                        {/* Buttons skeleton */}
                        <div className="flex flex-wrap gap-3 mt-3">
                            <div className="w-full sm:w-56 h-16 bg-gray-200 animate-pulse"></div>
                            <div className="w-full sm:w-56 h-16 bg-gray-200 animate-pulse"></div>
                        </div>

                        <Separator />

                        {/* SKU, Category, Vendor skeleton */}
                        <div className="flex items-center mt-1">
                            <div className="h-6 bg-gray-200 rounded-md w-12 animate-pulse"></div>
                            <div className="h-6 bg-gray-200 rounded-md w-28 ml-3 animate-pulse"></div>
                        </div>

                        <div className="flex items-center mt-1">
                            <div className="h-6 bg-gray-200 rounded-md w-20 animate-pulse"></div>
                            <div className="h-6 bg-gray-200 rounded-md w-28 ml-3 animate-pulse"></div>
                        </div>

                        <div className="flex items-center mt-1">
                            <div className="h-6 bg-gray-200 rounded-md w-16 animate-pulse"></div>
                            <div className="h-6 bg-gray-200 rounded-md w-32 ml-3 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Description skeleton */}
            <div className='p-5 flex flex-col justify-center items-center m-auto'>
                <Card className="w-[85%] p-8 flex flex-col gap-3 border border-grey-200">
                    <div className="h-8 bg-gray-200 rounded-md w-56 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-full animate-pulse mt-4"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-full animate-pulse mt-2"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-3/4 animate-pulse mt-2"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-5/6 animate-pulse mt-2"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-full animate-pulse mt-2"></div>
                </Card>

                {/* Reviews section skeleton */}
                <Card className="w-[85%] p-8 flex flex-col gap-3 mt-5">
                    <div className="h-7 bg-gray-200 rounded-md w-48 animate-pulse"></div>

                    <div className="flex flex-col gap-6 mt-4">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="border-b pb-4">
                                <div className="flex items-start gap-4">
                                    {/* Avatar skeleton */}
                                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>

                                    <div className="flex-1">
                                        {/* Reviewer info skeleton */}
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <div className="h-5 bg-gray-200 rounded-md w-32 animate-pulse"></div>
                                                <div className="h-5 bg-gray-200 rounded-md w-20 animate-pulse"></div>
                                            </div>
                                            <div className="h-4 bg-gray-200 rounded-md w-24 animate-pulse"></div>
                                        </div>

                                        {/* Review content skeleton */}
                                        <div className="h-4 bg-gray-200 rounded-md w-full animate-pulse mt-3"></div>
                                        <div className="h-4 bg-gray-200 rounded-md w-5/6 animate-pulse mt-2"></div>
                                        <div className="h-4 bg-gray-200 rounded-md w-4/6 animate-pulse mt-2"></div>

                                        {/* Rating skeleton */}
                                        <div className="h-4 bg-gray-200 rounded-md w-20 animate-pulse mt-2"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ProductSkeleton;