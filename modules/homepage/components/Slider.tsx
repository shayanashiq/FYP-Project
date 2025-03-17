'use client'

import React, { useState, useEffect } from 'react'
import Button from '@/common/components/elements/Button'

const sliderData = [
    {
        title: "Canon Camera",
        image: "/assets/img/8-1.png",
        price: "$89",
    },
    {
        title: "Sony Camera",
        image: "/assets/img/8-1.png",
        price: "$120",
    },
    {
        title: "Nikon DSLR",
        image: "/assets/img/8-1.png",
        price: "$150",
    }
];

const Slider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return; // Stop sliding when paused

        const interval = setInterval(() => {
            setCurrentSlide((prev) => {
                if (prev === sliderData.length - 1) {
                    setIsPaused(true); // Pause after the last slide
                    return 0; // Reset to the first slide after last
                }
                return prev + 1;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [isPaused]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY === 0) {
                setIsPaused(false); // Resume when user scrolls back to top
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleClick = () => {
        alert('Shop now');
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    return (
        <div className="relative w-[90%] ml-[5%] mt-20 h-[600px] flex items-center justify-center  overflow-hidden">
            <div className="container mx-auto relative">
                {/* Slide Content */}
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {sliderData.map((slide, index) => (
                        <div key={index} className="flex-none w-full flex items-center justify-between px-20">
                            <div className="flex flex-col space-y-8 text-cyan-800 text-5xl font-bold">
                                <div>{slide.title}</div>
                                <div className="text-sky-900 text-lg font-medium">Hello</div>
                                <div className="text-neutral-600 text-lg font-semibold">{slide.price}</div>

                                <div>
                                    <Button
                                        onClick={handleClick}
                                        className="w-64 h-14 bg-amber-500 text-white text-base font-semibold hover:bg-amber-600"
                                    >
                                        Shop Now
                                    </Button>
                                </div>
                            </div>
                            <img className="w-[400px] rounded-lg" src={slide.image} alt={slide.title} />
                        </div>
                    ))}
                </div>

                {/* Navigation Dots */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {sliderData.map((_, index) => (
                        <div
                            key={index}
                            className={`w-4 h-4 cursor-pointer rounded-full transition-all duration-300 
                                ${currentSlide === index ? 'bg-amber-500' : 'bg-gray-300'}`}
                            onClick={() => goToSlide(index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Slider;
