// 'use client'

// import React, { useState, useEffect } from 'react'
// import Button from '@/common/components/elements/Button'
// import xbox from "@/assets/imgs/xbox.png"

// const sliderData = [
//     {
//         title: "Xbox Consoles",
//         subtitle: "THE BEST PLACE TO PLAY",
//         description: "Save up to 50% on select Xbox games. Get 3 months of PC Game Pass for £2 USD.",
//         image: xbox,
//         price: "£299",
//         buttonText: "SHOP NOW"
//     },
//     // Add more slides as needed
//     {
//         title: "PlayStation 5",
//         subtitle: "NEXT GEN GAMING",
//         description: "Experience lightning-fast loading with an ultra-high speed SSD and immersive gameplay.",
//         image: "/assets/img/ps5-console.png",
//         price: "£499",
//         buttonText: "SHOP NOW"
//     },
//     {
//         title: "Nintendo Switch",
//         subtitle: "PLAY ANYWHERE",
//         description: "Play at home or on the go with the versatile Nintendo Switch gaming system.",
//         image: "/assets/img/switch-console.png",
//         price: "£299",
//         buttonText: "SHOP NOW"
//     }
// ];

// // Right side products data
// const rightProducts = [
//     {
//         title: "New Google Pixel 6 Pro",
//         image: "/assets/img/pixel-6-pro.png",
//         discount: "29% OFF",
//         category: "SUMMER SALES",
//         buttonText: "SHOP NOW"
//     },
//     {
//         title: "Xiaomi FlipBuds Pro",
//         image: "/assets/img/flipbuds-pro.png",
//         price: "£299 USD",
//         buttonText: "SHOP NOW"
//     }
// ];

// const Slider = () => {
//     const [currentSlide, setCurrentSlide] = useState(0);
//     const [isPaused, setIsPaused] = useState(false);
//     const [showCardsOnMobile, setShowCardsOnMobile] = useState(false);

//     useEffect(() => {
//         if (isPaused) return; // Stop sliding when paused

//         const interval = setInterval(() => {
//             setCurrentSlide((prev) => {
//                 if (prev === sliderData.length - 1) {
//                     setIsPaused(true); // Pause after the last slide
//                     return 0; // Reset to the first slide after last
//                 }
//                 return prev + 1;
//             });
//         }, 5000);

//         return () => clearInterval(interval);
//     }, [isPaused]);

//     useEffect(() => {
//         const handleScroll = () => {
//             if (window.scrollY === 0) {
//                 setIsPaused(false); // Resume when user scrolls back to top
//             }
//         };

//         window.addEventListener('scroll', handleScroll);
//         return () => window.removeEventListener('scroll', handleScroll);
//     }, []);

//     const handleClick = () => {
//         alert('Shop now');
//     };

//     const goToSlide = (index:any) => {
//         setCurrentSlide(index);
//         setIsPaused(true); // Pause automatic sliding when manually navigating
//     };

//     const goToPrevSlide = () => {
//         setCurrentSlide((prev) =>
//             prev === 0 ? sliderData.length - 1 : prev - 1
//         );
//         setIsPaused(true);
//     };

//     const goToNextSlide = () => {
//         setCurrentSlide((prev) =>
//             prev === sliderData.length - 1 ? 0 : prev + 1
//         );
//         setIsPaused(true);
//     };

//     const toggleMobileCards = () => {
//         setShowCardsOnMobile(!showCardsOnMobile);
//     };

//     return (
//         <div className="w-[90%] mx-auto mt-8 md:mt-20">
//             {/* Mobile Toggle Button (only visible on mobile) */}
//             {/* <div className="md:hidden mb-4 flex justify-between items-center">
//                 <h2 className="text-xl font-bold">Featured Products</h2>
//                 <button
//                     onClick={toggleMobileCards}
//                     className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
//                 >
//                     {showCardsOnMobile ? 'Hide Cards' : 'Show More Cards'}
//                 </button>
//             </div> */}

//             <div className="flex flex-col md:flex-row md:gap-4">
//                 {/* Main Slider (Full width on mobile, 2/3 width on md+) */}
//                 <div className="w-full md:w-2/3 bg-gray-100 rounded-lg relative overflow-hidden">
//                     {sliderData.map((slide, index) => (
//                         <div
//                             key={index}
//                             className={`${currentSlide === index ? 'block' : 'hidden'} p-4 md:p-8`}
//                         >
//                             <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//                                 <div className="flex flex-col space-y-2 md:space-y-4 max-w-md">
//                                     <div className="text-blue-500 text-xs md:text-sm font-medium">{slide.subtitle}</div>
//                                     <h2 className="text-2xl md:text-4xl font-bold text-gray-900">{slide.title}</h2>
//                                     <p className="text-gray-700 text-xs md:text-sm mb-4 md:mb-6">{slide.description}</p>

//                                     <Button
//                                         onClick={handleClick}
//                                         className="w-32 md:w-40 bg-amber-500 text-white text-xs md:text-sm font-medium hover:bg-amber-600"
//                                     >
//                                         {slide.buttonText} <span className="ml-2">→</span>
//                                     </Button>
//                                 </div>

//                                 <div className="relative mt-4 md:mt-0">
//                                     <div className="absolute -top-6 right-0 md:-top-10 md:-right-10 bg-blue-500 text-white rounded-full w-16 h-16 md:w-24 md:h-24 flex items-center justify-center text-base md:text-xl font-bold">
//                                         {slide.price}
//                                     </div>
//                                     <img
//                                         src={slide.image}
//                                         alt={slide.title}
//                                         className="max-h-48 md:max-h-80 mx-auto md:mx-0 object-contain"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Navigation Controls */}
//                             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0 flex items-center space-x-4">
//                                 {/* Previous Arrow */}
//                                 <button
//                                     onClick={goToPrevSlide}
//                                     className="w-4 h-4 flex items-center justify-center"
//                                 >
//                                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                         <path d="M16 4L8 12L16 20" stroke="gray" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
//                                     </svg>
//                                 </button>

//                                 {/* Navigation Dots */}
//                                 <div className="flex space-x-2">
//                                     {sliderData.map((_, idx) => (
//                                         <div
//                                             key={idx}
//                                             className={`h-2 cursor-pointer rounded-full transition-all duration-300
//                                                 ${currentSlide === idx ? 'bg-black w-2' : 'bg-gray-300 w-2'}`}
//                                             onClick={() => goToSlide(idx)}
//                                         />
//                                     ))}
//                                 </div>

//                                 {/* Next Arrow */}
//                                 <button
//                                     onClick={goToNextSlide}
//                                     className="w-4 h-4 flex items-center justify-center"
//                                 >
//                                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                         <path d="M8 4L16 12L8 20" stroke="gray" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
//                                     </svg>
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Right Side Products - Hidden by default on mobile, shown when toggled or always visible on md+ */}
//                 <div className={`${showCardsOnMobile ? 'block' : 'hidden'} md:block w-full md:w-1/3 flex flex-col gap-4 mt-4 md:mt-0`}>
//                     {/* Top Product - Google Pixel */}
//                     <div className="bg-gray-900 text-white p-4 rounded-lg relative h-40 md:h-1/2">
//                         <div className="absolute top-3 right-3 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
//                             {rightProducts[0].discount}
//                         </div>
//                         <div className="text-xs text-yellow-400 mb-1">{rightProducts[0].category}</div>
//                         <h3 className="text-lg font-medium">{rightProducts[0].title}</h3>

//                         <div className="flex justify-between items-end mt-2">
//                             <Button
//                                 onClick={handleClick}
//                                 className="bg-amber-500 text-white text-xs font-medium hover:bg-amber-600"
//                             >
//                                 {rightProducts[0].buttonText} <span className="ml-1">→</span>
//                             </Button>
//                             <img
//                                 src={rightProducts[0].image}
//                                 alt={rightProducts[0].title}
//                                 className="h-20 md:h-28 object-contain"
//                             />
//                         </div>
//                     </div>

//                     {/* Bottom Product - Xiaomi FlipBuds */}
//                     <div className="bg-gray-100 p-4 rounded-lg h-40 md:h-1/2">
//                         <div className="flex justify-between">
//                             <div>
//                                 <h3 className="text-lg font-medium text-gray-900">{rightProducts[1].title}</h3>
//                                 <p className="text-blue-500 mt-1">{rightProducts[1].price}</p>

//                                 <Button
//                                     onClick={handleClick}
//                                     className="bg-amber-500 text-white text-xs font-medium mt-4 hover:bg-amber-600"
//                                 >
//                                     {rightProducts[1].buttonText} <span className="ml-1">→</span>
//                                 </Button>
//                             </div>
//                             <img
//                                 src={rightProducts[1].image}
//                                 alt={rightProducts[1].title}
//                                 className="h-20 md:h-28 object-contain"
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Slider;

"use client";

import React, { useState, useEffect } from "react";
import Button from "@/common/components/elements/Button";
import xbox from "@/assets/imgs/xbox.png";
import playstation5 from "@/assets/imgs/Playstation5.png";
import { motion, AnimatePresence } from "framer-motion";
import nintidoSwitch from "@/assets/imgs/nintendo-switch.png";

const sliderData = [
  {
    title: "Xbox Series X",
    subtitle: "THE ULTIMATE GAMING EXPERIENCE",
    description:
      "Experience true 4K gaming at up to 120 FPS with the world's most powerful console.",
    image: xbox,
    price: "£499",
    buttonText: "SHOP NOW",
    bgGradient: "linear-gradient(135deg, #107c10 0%, #0e5a0e 100%)",
    textColor: "text-white",
  },
  {
    title: "PlayStation 5",
    subtitle: "NEXT GEN GAMING",
    description:
      "Lightning-fast loading with ultra-high speed SSD and haptic feedback.",
    image: playstation5,
    price: "£499",
    buttonText: "SHOP NOW",
    bgGradient: "linear-gradient(135deg, #003791 0%, #001f5b 100%)",
    textColor: "text-white",
  },
  {
    title: "Nintendo Switch OLED",
    subtitle: "PLAY ANYWHERE",
    description:
      "Vibrant 7-inch OLED screen with enhanced audio for handheld play.",
    image: nintidoSwitch,
    price: "£349",
    buttonText: "SHOP NOW",
    bgGradient: "linear-gradient(135deg, #e60012 0%, #b3000e 100%)",
    textColor: "text-white",
  },
];

const rightProducts = [
  {
    title: "Google Pixel 7 Pro",
    image: "/assets/imgs/pixel-7-pro.png",
    discount: "29% OFF",
    category: "SUMMER SALE",
    buttonText: "SHOP NOW",
    bgColor: "bg-gradient-to-br from-[#4285F4] to-[#34A853]",
    textColor: "text-white",
  },
  {
    title: "Xiaomi Buds 4 Pro",
    image: "/assets/imgs/flipbuds-pro.png",
    price: "£199",
    buttonText: "SHOP NOW",
    bgColor: "bg-gradient-to-br from-gray-100 to-gray-200",
    textColor: "text-gray-900",
  },
];

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) =>
        prev === sliderData.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovered]);

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev === 0 ? sliderData.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev === sliderData.length - 1 ? 0 : prev + 1));
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Slider */}
        <div
          className="w-full lg:w-2/3 relative rounded-2xl overflow-hidden shadow-2xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className={`absolute inset-0 p-8 md:p-12 flex flex-col justify-between ${sliderData[currentSlide].textColor}`}
              style={{
                background: sliderData[currentSlide].bgGradient,
              }}
            >
              <div className="flex flex-col md:flex-row h-full">
                <div className="w-full md:w-1/2 flex flex-col justify-center space-y-4 md:space-y-6">
                  <span className="text-sm md:text-base font-medium tracking-wider opacity-90">
                    {sliderData[currentSlide].subtitle}
                  </span>
                  <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                    {sliderData[currentSlide].title}
                  </h2>
                  <p className="text-sm md:text-base opacity-90 max-w-md">
                    {sliderData[currentSlide].description}
                  </p>
                  <div className="mt-4">
                    <Button className="px-8 py-3 bg-white text-gray-900 hover:bg-gray-100 font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      {sliderData[currentSlide].buttonText}
                      <span className="ml-2">→</span>
                    </Button>
                  </div>
                </div>
                <div className="w-full md:w-1/2 flex items-center justify-center relative">
                  <div className="absolute -top-4 -right-4 bg-white text-gray-900 rounded-full w-20 h-20 md:w-24 md:h-24 flex items-center justify-center text-xl md:text-2xl font-bold shadow-lg">
                    {sliderData[currentSlide].price}
                  </div>
                  <motion.img
                    src={
                      typeof sliderData[currentSlide].image === "string"
                        ? sliderData[currentSlide].image
                        : sliderData[currentSlide].image.src
                    }
                    alt={sliderData[currentSlide].title}
                    className="max-h-48 md:max-h-72 object-contain"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                  />
                </div>
              </div>

              {/* Navigation Dots */}
              <div className="flex justify-center space-x-2 mt-4 md:mt-0">
                {sliderData.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentSlide === idx ? "bg-white w-6" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-all duration-300 z-10"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={goToNextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-all duration-300 z-10"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Right Side Products */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          {rightProducts.map((product, index) => (
            <motion.div
              key={index}
              className={`${product.bgColor} ${product.textColor} rounded-2xl p-6 shadow-lg overflow-hidden relative h-48`}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {product.discount && (
                <div className="absolute top-4 right-4 bg-amber-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                  {product.discount}
                </div>
              )}
              {product.category && (
                <span className="text-xs font-medium tracking-wider opacity-90">
                  {product.category}
                </span>
              )}
              <h3 className="text-xl font-bold mt-2 mb-4">{product.title}</h3>
              {product.price && (
                <p className="text-lg font-semibold mb-4">{product.price}</p>
              )}
              <Button className="absolute bottom-6 left-6 px-6 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 rounded-full transition-all duration-300">
                {product.buttonText}
              </Button>
              <motion.img
                src={product.image}
                alt={product.title}
                className="absolute bottom-0 right-0 h-32 object-contain"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
