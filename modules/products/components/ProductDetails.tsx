"use client"


import { Card } from '@/common/components/elements/Card'
import { Separator } from '@/common/components/elements/Separator'
import Star from '@/common/components/elements/Star'
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation';
import Image from 'next/image'

// Define TypeScript interfaces
interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

interface Vendor {
  id: string;
  name: string;
  email: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  discount: number;
  stock: number;
  sku?: string;
  images?: string[];
  colors?: string[];
  sizes?: string[];
  category?: Category;
  vendor?: Vendor;
  reviews: Review[];
  avgRating: number;
  reviewCount: number;
}

const ProductDetails: React.FC = () => {
  const params = useParams();
  const id = params.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('reviews');

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }

        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handlePrevImage = (): void => {
    if (!product?.images?.length) return;
    setCurrentImageIndex(prev =>
      prev === 0 ? product.images!.length - 1 : prev - 1
    );
  };

  const handleNextImage = (): void => {
    if (!product?.images?.length) return;
    setCurrentImageIndex(prev =>
      prev === product.images!.length - 1 ? 0 : prev + 1
    );
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const increaseQuantity = (): void => {
    product && setQuantity(prev => (prev < product.stock ? prev + 1 : prev));
  };


  const decreaseQuantity = (): void => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-14 flex justify-center items-center">
        <div className="text-xl">Loading product details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-14 flex justify-center items-center">
        <div className="text-xl">Product not found</div>
      </div>
    );
  }

  // Use placeholder images if product doesn't have images
  const images = product.images

  return (
    <div className='container mx-auto'>
      <div className='min-h-full flex flex-col lg:flex-row py-14'>
        <div className="w-full lg:w-1/2 h-full justify-center items-center gap-5 flex flex-col">
          <Card className="w-full max-w-[500px] h-96 justify-center items-center gap-5 flex relative cursor-pointer hover:bg-slate-100">
            {images && (
              <img
                className='p-5 max-h-full max-w-full object-contain'
                src={images[currentImageIndex]}
                alt={product.name}
              />
            )}

            {/* Left Arrow */}
            <button
              onClick={handlePrevImage}
              className="absolute left-2 bg-white bg-opacity-70 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-100"
              aria-label="Previous image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right Arrow */}
            <button
              onClick={handleNextImage}
              className="absolute right-2 bg-white bg-opacity-70 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-100"
              aria-label="Next image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </Card>

          <div className="flex m-auto flex-wrap gap-5 group">
            {images && images.map((img, index) => (
              <Card
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-28 h-28 md:w-36 md:h-32 justify-center items-center gap-5 flex relative cursor-pointer ${currentImageIndex === index ? 'ring-2 ring-sky-900' : 'hover:bg-slate-100'
                  }`}
              >
                <img
                  src={img}
                  alt={`Product image ${index + 1}`}
                  className="max-h-full max-w-full object-contain p-2"
                />
              </Card>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-1/2 h-full lg:h-auto lg:flex lg:ml-5">
          <div className="w-full max-w-[500px] h-full lg:h-auto lg:w-full flex-col gap-2 flex mt-10 lg:mt-0 mx-auto px-4 lg:px-0">
            <div className="flex-col gap-2.5 flex">
              <div className="text-sky-900 font-semibold text-2xl">{product.name}</div>
              {product.discount ? (
                <div className="text-red-600 text-2xl font-semibold">
                  ${product.price - product.discount}{" "}
                  <span className="text-neutral-600 line-through text-xl">${product.price}</span>
                </div>
              ) : (
                <div className="text-neutral-600 text-2xl font-semibold">${product.price}</div>
              )}
            </div>


            <div className="justify-normal gap-2.5 flex items-center">
              <Star count={Math.round(product.avgRating || 5)} />
              <div className="text-neutral-600 text-sm font-medium">
                {product.reviewCount > 0
                  ? `${product.reviewCount} review${product.reviewCount !== 1 ? 's' : ''}`
                  : 'No reviews'
                }
              </div>
            </div>

            <div className="gap-5 flex">
              <div className="text-neutral-800 text-lg font-medium">Availability:</div>
              <div className="gap-3.5 flex">
                <div className={`text-lg font-medium ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {product.stock > 0 ? 'In stock' : 'Out of stock'}
                </div>
              </div>
            </div>

            {product.stock > 0 && (
              <div className="text-zinc-600 text-base font-medium">
                Hurry up! only {product.stock} product{product.stock !== 1 ? 's' : ''} left in stock!
              </div>
            )}

            <Separator />

            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center">
                <span className='font-semibold'>Color:</span>
                <div className="flex gap-2 ml-3">
                  {product.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full cursor-pointer border border-gray-300"
                      style={{ backgroundColor: color }}
                      aria-label={`Color: ${color}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="flex items-center">
                <span className='font-semibold'>Size:</span>
                <div className="flex gap-2 ml-3 flex-wrap">
                  {product.sizes.map((size, index) => (
                    <button
                      key={index}
                      className="w-16 h-8 bg-zinc-100 border items-center justify-center flex focus:bg-blue-200"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center">
              <span className='font-semibold'>Quantity:</span>
              <div className="flex gap-0 ml-3">
                <button
                  onClick={decreaseQuantity}
                  className="w-10 h-8 bg-zinc-100 border items-center justify-center flex"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <input
                  type="text"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-14 h-8 bg-zinc-100 border border-slate-200 focus:ring-0 focus:border-slate-200 text-center"
                  aria-label="Quantity"
                />
                <button
                  onClick={increaseQuantity}
                  className="w-10 h-8 bg-zinc-100 border items-center justify-center flex"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-3">
              <button
                disabled={product.stock <= 0}
                className='w-full sm:w-56 h-16 bg-amber-500 text-white text-lg font-medium rounded-full disabled:bg-gray-400 disabled:cursor-not-allowed'
              >
                Add to cart
              </button>
              <button
                disabled={product.stock <= 0}
                className='w-full sm:w-56 h-16 bg-amber-500 text-white text-lg font-medium rounded-full disabled:bg-gray-400 disabled:cursor-not-allowed'
              >
                Buy it now
              </button>
              
            </div>

            <Separator />

            <div className="flex items-center">
              <div className='font-semibold'>Sku:</div>
              <span className='ml-3'>{product.sku || 'N/A'}</span>
            </div>

            <div className="flex items-center">
              <div className='font-semibold'>Category:</div>
              <div className='flex ml-3 gap-2'>
                {product.category ? (
                  <span className='flex text-sm'>{product.category.name}</span>
                ) : (
                  <span className='flex text-sm'>Uncategorized</span>
                )}
              </div>
            </div>

            {product.vendor && (
              <div className="flex items-center">
                <div className='font-semibold'>Vendor:</div>
                <span className='ml-3'>{product.vendor.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>



      <div className='p-5 flex flex-col justify-center items-center m-auto'>
        <Card className="w-[85%] p-8 flex flex-col gap-3">
          <span className='font-semibold text-sky-900 text-xl mb-2'>Product Description</span>
          <div className="text-gray-700">
            {product.description || 'No description available for this product.'}
          </div>
        </Card>
        <Card className="w-[85%] p-8 flex flex-col gap-3">
          <span className='font-semibold text-sky-900 text-xl'>Customer Reviews</span>

          {product.reviews && product.reviews.length > 0 ? (
            <div className="flex flex-col gap-4 mt-2">
              {product.reviews.map((review) => (
                <div key={review.id} className="border-b pb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{review.user?.name || 'Anonymous'}</span>
                    <Star count={review.rating} />
                  </div>
                  <p className="mt-2 text-gray-700">{review.comment}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <span className='text-slate-500'>No reviews yet</span>
          )}

          <button className='bg-sky-900 text-white w-36 h-10 mt-4'>Write a review</button>
        </Card>
      </div>
    </div>
  )
}

export default ProductDetails