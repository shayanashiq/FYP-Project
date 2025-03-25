// components/CartDisplay.tsx
"use client"

import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Product {
    id: string;
    name: string;
    description: string;
    shortDescription: string;
    price: number | string;
    discount: number | string | null;  // Discount as percentage
    images: string[];
    stock: number;
    color: string[];
    size: string[];
}

interface CartItem {
    id: string;
    quantity: number;
    product: Product;
    productId: string;
}

interface Cart {
    id: string;
    userId: string;
    items: CartItem[];
}

const CartDisplay: React.FC = () => {
    const { data: session, status } = useSession();
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const router = useRouter();

    // Memoized fetch function to prevent unnecessary re-creation
    const fetchCart = useCallback(async () => {
        // Only fetch if user is authenticated and we're not already loading
        if (!session?.user?.id || loading) return;

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/cart?userId=${session.user.id}`, {
                // Add cache-control to reduce unnecessary network requests
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch cart');
            }

            const { data } = await response.json();
            setCart(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    }, [session?.user?.id, loading]);

    // Use useEffect to fetch cart only when needed
    useEffect(() => {
        // Only fetch if authenticated and no existing cart
        if (status === 'authenticated' && !cart) {
            fetchCart();
        }
    }, [status, cart, fetchCart]);

    const updateQuantity = async (productId: string, newQuantity: number) => {
        if (!session?.user?.id) return;

        try {
            // Get the current quantity of the item
            const currentItem = cart?.items.find(item => item.productId === productId);
            const currentQuantity = currentItem?.quantity || 0;

            // Calculate the quantity difference
            const quantityDifference = newQuantity - currentQuantity;

            // Only make the request if there's a change
            if (quantityDifference !== 0) {
                const response = await fetch('/api/cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: session.user.id,
                        productId,
                        quantity: quantityDifference,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to update cart');
                }

                // Refetch cart after update
                const cartResponse = await fetch(`/api/cart?userId=${session.user.id}`);
                const { data } = await cartResponse.json();
                setCart(data);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        }
    };

    const deleteCartItem = async (itemId: string) => {
        if (!session?.user?.id) return;

        try {
            const response = await fetch(`/api/cart/item?itemId=${itemId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete item');
            }

            // Update local state by removing the item
            if (cart) {
                setCart({
                    ...cart,
                    items: cart.items.filter(item => item.id !== itemId)
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        }
    };

    // Fallback method that uses the existing API if DELETE endpoint is not available
    const removeItem = async (productId: string) => {
        if (!session?.user?.id) return;

        const item = cart?.items.find(item => item.productId === productId);
        if (!item) return;

        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: session.user.id,
                    productId,
                    quantity: -item.quantity, // Negative quantity to remove all
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to remove item');
            }

            // Refetch cart after update
            const cartResponse = await fetch(`/api/cart?userId=${session.user.id}`);
            const { data } = await cartResponse.json();
            setCart(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        }
    };

    // Calculate price after discount based on percentage
    const calculateDiscountedPrice = (price: number, discountPercentage: number): number => {
        if (!discountPercentage) return price;
        return price * (1 - discountPercentage / 100);
    };

    const calculateTotal = () => {
        if (!cart?.items.length) return 0;
        return cart.items.reduce((total, item) => {
            // Convert price and discount to numbers to avoid toFixed issues
            const price = typeof item.product.price === 'string'
                ? parseFloat(item.product.price)
                : item.product.price;

            const discountPercentage = item.product.discount
                ? (typeof item.product.discount === 'string'
                    ? parseFloat(item.product.discount)
                    : item.product.discount)
                : 0;

            // Apply discount if available (as percentage)
            const priceAfterDiscount = calculateDiscountedPrice(price, discountPercentage);
            return total + priceAfterDiscount * item.quantity;
        }, 0);
    };

    // Format price safely with fallback
    const formatPrice = (price: number | string | null | undefined): string => {
        if (price === null || price === undefined) return "0.00";

        const numPrice = typeof price === 'string' ? parseFloat(price) : price;

        if (isNaN(numPrice)) return "0.00";

        return numPrice.toFixed(2);
    };

    // New function to create an order before proceeding to checkout
    const createOrderAndProceedToCheckout = async () => {
        if (!session?.user?.id || !cart || cart.items.length === 0) return;
    
        try {
            setIsCreatingOrder(true);
            setError(null);
    
            const orderItems = cart.items.map(item => {
                const price = typeof item.product.price === 'string'
                    ? parseFloat(item.product.price)
                    : item.product.price;
    
                const discountPercentage = item.product.discount
                    ? (typeof item.product.discount === 'string'
                        ? parseFloat(item.product.discount)
                        : item.product.discount)
                    : 0;
    
                return {
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: price,
                    discountPercentage: discountPercentage
                };
            });
    
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: session.user.id,
                    items: orderItems,
                    // Add shipping details
                    shippingFirstName: '', // Replace with actual user data
                    shippingLastName: '',
                    shippingStreet: '',
                    shippingCity: '',
                    shippingState: '',
                    shippingPostalCode: '',
                    shippingCountry: '',
                    shippingPhone: '',
                    email: session.user.email,
                    useSameAddress: true // Or false if separate billing
                }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create order');
            }
    
            const { data } = await response.json();
            const orderId = data.id; // Assuming the API returns the order ID in the data object
    
            router.push(`/account/checkout?orderId=${orderId}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsCreatingOrder(false);
        }
    };

    // Optional: Add a manual refresh method
    const refreshCart = () => {
        fetchCart();
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading your cart...</div>;
    }

    if (error) {
        return <div className="text-red-500 p-4 bg-red-50 rounded">{error}</div>;
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h2 className="text-xl font-semibold mb-4">Your Cart is Empty</h2>
                <p className="text-gray-600 mb-4">Add some products to your cart to see them here.</p>
                <button
                    onClick={() => router.push('/products')}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white p-12">
            {error && <div className="text-red-500 p-2 mb-4 bg-red-50 rounded">{error}</div>}

            <div className="divide-y divide-gray-200">
                {cart.items.map((item) => {
                    const price = typeof item.product.price === 'string'
                        ? parseFloat(item.product.price)
                        : item.product.price;

                    const discountPercentage = item.product.discount
                        ? (typeof item.product.discount === 'string'
                            ? parseFloat(item.product.discount)
                            : item.product.discount)
                        : 0;

                    const priceAfterDiscount = calculateDiscountedPrice(price, discountPercentage);

                    return (
                        <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center">
                            <div className="w-full sm:w-20 h-20 relative mb-4 sm:mb-0">
                                {item.product.images && item.product.images.length > 0 ? (
                                    <Image
                                        src={item.product.images[0]}
                                        alt={item.product.name}
                                        fill
                                        sizes="80px"
                                        className="object-cover rounded"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                                        <span className="text-gray-400">No image</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex-grow px-4">
                                <h3 className="font-medium">{item.product.name}</h3>
                                <p className="text-gray-500 text-sm">{item.product.shortDescription}</p>

                                {item.product.color && item.product.color.length > 0 && (
                                    <div className="flex items-center mt-1">
                                        <span className="text-gray-500 text-xs mr-2">Color:</span>
                                        <span className="text-gray-700 text-xs">{item.product.color.join(', ')}</span>
                                    </div>
                                )}

                                {item.product.size && item.product.size.length > 0 && (
                                    <div className="flex items-center mt-1">
                                        <span className="text-gray-500 text-xs mr-2">Size:</span>
                                        <span className="text-gray-700 text-xs">{item.product.size.join(', ')}</span>
                                    </div>
                                )}

                                <div className="mt-1">
                                    {discountPercentage > 0 ? (
                                        <div className="flex items-center">
                                            <p className="text-gray-700 font-medium">${formatPrice(priceAfterDiscount)}</p>
                                            <p className="text-gray-400 line-through text-sm ml-2">${formatPrice(price)}</p>
                                            <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded">
                                                {discountPercentage}% OFF
                                            </span>
                                        </div>
                                    ) : (
                                        <p className="text-gray-700 font-medium">${formatPrice(price)}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center mt-4 sm:mt-0">
                                <div className="flex items-center border border-gray-300 rounded">
                                    <button
                                        onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                        disabled={item.quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span className="px-3 py-1">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                        disabled={item.quantity >= item.product.stock}
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    onClick={() => item.id ? deleteCartItem(item.id) : removeItem(item.productId)}
                                    className="ml-4 text-red-500 hover:text-red-700"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>${formatPrice(calculateTotal())}</span>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={createOrderAndProceedToCheckout}
                        disabled={isCreatingOrder}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed">
                        {isCreatingOrder ? 'Creating Order...' : 'Proceed to Checkout'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartDisplay;