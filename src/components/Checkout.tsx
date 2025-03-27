"use client"

import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { OrderStatus } from '@prisma/client';

// Typescript types matching Prisma schema
interface Product {
    id: string;
    name: string;
    images: string[];
    price: number;
}

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    product: Product;
}

interface Payment {
    id: string;
    method: string;
    status: string;
}

interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    totalPrice: number;
    status: string;
    payment: Payment;
    createdAt: string;

    shippingFirstName: string;
    shippingLastName: string;
    shippingStreet: string;
    shippingCity: string;
    shippingState?: string;
    shippingPostalCode: string;
    shippingCountry: string;
    shippingPhone: string;

    billingFirstName?: string;
    billingLastName?: string;
    billingStreet?: string;
    billingCity?: string;
    billingState?: string;
    billingPostalCode?: string;
    billingCountry?: string;

    email: string;
}

// Customer Profile Interface
interface CustomerProfile {
    firstName: string;
    lastName: string;
    streetAddress: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    phone?: string;
}

const GUEST_EMAIL_KEY = 'guestEmail';

const CheckoutPage = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    const [order, setOrder] = useState<Order | null>(null);
    const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);

    // Comprehensive form data state
    const [formData, setFormData] = useState({
        // Shipping Details
        shippingFirstName: '',
        shippingLastName: '',
        shippingStreet: '',
        shippingCity: '',
        shippingState: '',
        shippingPostalCode: '',
        shippingCountry: '',
        shippingPhone: '',

        // Billing Details
        useSameAddress: true,
        billingFirstName: '',
        billingLastName: '',
        billingStreet: '',
        billingCity: '',
        billingState: '',
        billingPostalCode: '',
        billingCountry: '',

        // Payment
        paymentMethod: 'CREDIT_CARD',
        email: '',

        // Credit Card Details
        cardNumber: '',
        cardExpiry: '',
        cardCVV: '',
        cardName: ''
    });

    // Get guest cart ID from localStorage
    const getGuestCartId = useCallback(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('guestCartId');
        }
        return null;
    }, []);

    // Create order and proceed to checkout
    const createOrderAndProceedToCheckout = useCallback(async () => {
        if ((!session?.user?.id && !getGuestCartId()) || !orderId) return;
    
        try {
            setIsCreatingOrder(true);
            setError(null);
    
            const orderItems = order?.items.map(item => ({
                productId: item.product.id,
                quantity: item.quantity,
                unitPrice: typeof item.product.price === 'string' 
                    ? parseFloat(item.product.price) 
                    : item.product.price,
                discountPercentage: 0 // You can add discount logic here if needed
            })) || [];
    
            const requestBody: any = {
                items: orderItems,
                useSameAddress: true,
            };
    
            if (session?.user?.id) {
                requestBody.userId = session.user.id;
                requestBody.email = session.user.email;
            } else {
                const guestCartId = getGuestCartId();
                requestBody.guestCartId = guestCartId;
                requestBody.guestEmail = localStorage.getItem("guestEmail") || null;
            }
    
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create order');
            }
    
            const { data } = await response.json();
            router.push(`/checkout?orderId=${data.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsCreatingOrder(false);
        }
    }, [order, session, router, getGuestCartId, orderId]);

    // Fetch customer profile
    const fetchCustomerProfile = async () => {
        if (!session?.user?.id) return;

        try {
            const response = await fetch('/api/customer-profile');

            if (!response.ok) {
                // Not an error if profile doesn't exist
                return;
            }

            const { data } = await response.json();
            setCustomerProfile(data);
        } catch (err) {
            console.error('Error fetching customer profile:', err);
        }
    };

    // Fetch order details
    const fetchOrder = async () => {
        if (!orderId) {
            return;
        }
    
        try {
            // Construct query parameters
            const queryParams = new URLSearchParams();
            
            if (session?.user?.id) {
                queryParams.append('userId', session.user.id);
            } else {
                const guestEmail = localStorage.getItem(GUEST_EMAIL_KEY);
                if (guestEmail) {
                    console.log("email")
                    queryParams.append('guestEmail', guestEmail);
                } else {
                    console.log("no email")
                    // If no session and no guest email, we can't proceed
                    throw new Error('Guest email is required for guest checkout');
                }
            }
    
            const response = await fetch(`/api/orders/${orderId}?${queryParams.toString()}`);
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || errorData.message || 'Failed to fetch order');
            }
    
            const { data } = await response.json();
            setOrder(data);
    
            // Pre-fill form data if order exists
            if (data) {
                setFormData(prev => ({
                    ...prev,
                    shippingFirstName: data.shippingFirstName || '',
                    shippingLastName: data.shippingLastName || '',
                    shippingStreet: data.shippingStreet || '',
                    shippingCity: data.shippingCity || '',
                    shippingState: data.shippingState || '',
                    shippingPostalCode: data.shippingPostalCode || '',
                    shippingCountry: data.shippingCountry || '',
                    shippingPhone: data.shippingPhone || '',
    
                    billingFirstName: data.billingFirstName || '',
                    billingLastName: data.billingLastName || '',
                    billingStreet: data.billingStreet || '',
                    billingCity: data.billingCity || '',
                    billingState: data.billingState || '',
                    billingPostalCode: data.billingPostalCode || '',
                    billingCountry: data.billingCountry || '',
    
                    email: data.email || (session?.user?.email || ''),
                    paymentMethod: data.payment?.method || 'CREDIT_CARD'
                }));
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while loading your order');
        }
    };

    const processPayment = async () => {
        if (!order) return;

        try {
            setProcessingPayment(true);
            setError(null);

            // Prepare order update payload
            const orderUpdatePayload = {
                // Shipping details
                shippingFirstName: formData.shippingFirstName,
                shippingLastName: formData.shippingLastName,
                shippingStreet: formData.shippingStreet,
                shippingCity: formData.shippingCity,
                shippingState: formData.shippingState,
                shippingPostalCode: formData.shippingPostalCode,
                shippingCountry: formData.shippingCountry,
                shippingPhone: formData.shippingPhone,

                // Billing details
                billingFirstName: formData.useSameAddress ? null : formData.billingFirstName,
                billingLastName: formData.useSameAddress ? null : formData.billingLastName,
                billingStreet: formData.useSameAddress ? null : formData.billingStreet,
                billingCity: formData.useSameAddress ? null : formData.billingCity,
                billingState: formData.useSameAddress ? null : formData.billingState,
                billingPostalCode: formData.useSameAddress ? null : formData.billingPostalCode,
                billingCountry: formData.useSameAddress ? null : formData.billingCountry,

                // Authentication
                ...(session?.user?.id ? { userId: session.user.id } : { guestEmail: localStorage.getItem(GUEST_EMAIL_KEY) }),

                // Email and payment details
                email: formData.email,
                paymentMethod: formData.paymentMethod,
                status: OrderStatus.CONFIRMED 
            };

            // Update order and process payment
            const response = await fetch(`/api/orders/${order.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderUpdatePayload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || errorData.message || 'Payment processing failed');
            }

            // Redirect to order confirmation
            router.push(`/account/orders/confirmation?orderId=${order.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Payment processing failed. Please try again.');
        } finally {
            setProcessingPayment(false);
        }
    };
    // Use Effects for data fetching and pre-filling
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([
                fetchCustomerProfile(),
                fetchOrder()
            ]);
            setLoading(false);
        };

        fetchData();
    }, [session?.user?.id, orderId]);

    // Pre-fill from customer profile if no order data
    useEffect(() => {
        if (customerProfile && (!order || !order.shippingFirstName)) {
            setFormData(prev => ({
                ...prev,
                shippingFirstName: prev.shippingFirstName || customerProfile.firstName || '',
                shippingLastName: prev.shippingLastName || customerProfile.lastName || '',
                shippingStreet: prev.shippingStreet || customerProfile.streetAddress || '',
                shippingCity: prev.shippingCity || customerProfile.city || '',
                shippingState: prev.shippingState || customerProfile.state || '',
                shippingPostalCode: prev.shippingPostalCode || customerProfile.postalCode || '',
                shippingCountry: prev.shippingCountry || customerProfile.country || '',
                shippingPhone: prev.shippingPhone || customerProfile.phone || '',

                // Also pre-fill email if not already set
                email: prev.email || session?.user?.email || ''
            }));
        }
    }, [customerProfile, order, session]);

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Toggle billing address same as shipping
    const handleSameAddressToggle = () => {
        setFormData(prev => ({
            ...prev,
            useSameAddress: !prev.useSameAddress,
            billingFirstName: prev.useSameAddress ? prev.shippingFirstName : '',
            billingLastName: prev.useSameAddress ? prev.shippingLastName : '',
            billingStreet: prev.useSameAddress ? prev.shippingStreet : '',
            billingCity: prev.useSameAddress ? prev.shippingCity : '',
            billingState: prev.useSameAddress ? prev.shippingState : '',
            billingPostalCode: prev.useSameAddress ? prev.shippingPostalCode : '',
            billingCountry: prev.useSameAddress ? prev.shippingCountry : ''
        }));
    };

    // Format price safely
    const formatPrice = (price: number | string | null | undefined): string => {
        if (price === null || price === undefined) return "0.00";

        const numPrice = typeof price === 'string' ? parseFloat(price) : price;

        if (isNaN(numPrice)) return "0.00";

        return numPrice.toFixed(2);
    };

    

    if (loading || isCreatingOrder) {
        return <div className="flex justify-center items-center h-64">Loading checkout...</div>;
    }

    if (error) {
        return (
            <div className="p-12 mx-auto">
                <div className="text-red-500 p-4 bg-red-50 rounded">{error}</div>
                <div className="text-center mt-4">
                    <button
                        onClick={() => router.push('/cart')}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        Return to Cart
                    </button>
                </div>
            </div>
        );
    }

    if (!order && !isCreatingOrder) {
        return (
            <div className="p-12 mx-auto">
                <div className="bg-white p-6 rounded-lg  text-center">
                    <h2 className="text-xl font-semibold mb-4">Order Not Found</h2>
                    <p className="text-gray-600 mb-4">The order you're looking for doesn't exist or you don't have permission to view it.</p>
                    <button
                        onClick={() => router.push('/products')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-12 mx-auto">
            <div className="bg-white p-6 rounded-lg  mb-6">
                <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

                {/* Order Summary Section */}
                <div className="mb-6">
                    <h2 className="text-lg font-medium mb-3">Order Summary</h2>
                    <div className="border rounded-md overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Product</th>
                                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Qty</th>
                                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Price</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {order?.items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 relative mr-3">
                                                    {item.product.images && item.product.images.length > 0 ? (
                                                        <Image
                                                            src={item.product.images[0]}
                                                            alt={item.product.name}
                                                            fill
                                                            sizes="48px"
                                                            className="object-cover rounded"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                                                            <span className="text-gray-400 text-xs">No image</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{item.product.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">{item.quantity}</td>
                                        <td className="px-4 py-3 text-right">${formatPrice(item.price)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-50">
                                <tr>
                                    <td colSpan={2} className="px-4 py-3 text-right font-semibold">Total:</td>
                                    <td className="px-4 py-3 text-right font-semibold">${formatPrice(order?.totalPrice)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Shipping Details Section */}
                <div className="mb-6">
                    <h2 className="text-lg font-medium mb-3">Shipping Details</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="shippingFirstName" className="block text-sm font-medium text-gray-700 mb-1">
                                First Name
                            </label>
                            <input
                                type="text"
                                id="shippingFirstName"
                                name="shippingFirstName"
                                placeholder="Enter First Name"
                                value={formData.shippingFirstName}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="shippingLastName" className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="shippingLastName"
                                name="shippingLastName"
                                placeholder="Enter Last Name"
                                value={formData.shippingLastName}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div className="col-span-2">
                            <label htmlFor="shippingStreet" className="block text-sm font-medium text-gray-700 mb-1">
                                Street Address
                            </label>
                            <input
                                type="text"
                                id="shippingStreet"
                                name="shippingStreet"
                                placeholder="Enter Street Address"
                                value={formData.shippingStreet}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="shippingCity" className="block text-sm font-medium text-gray-700 mb-1">
                                City
                            </label>
                            <input
                                type="text"
                                id="shippingCity"
                                name="shippingCity"
                                placeholder="Enter City"
                                value={formData.shippingCity}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="shippingState" className="block text-sm font-medium text-gray-700 mb-1">
                                State/Province
                            </label>
                            <input
                                type="text"
                                id="shippingState"
                                name="shippingState"
                                placeholder="Enter State"
                                value={formData.shippingState}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div>
                            <label htmlFor="shippingPostalCode" className="block text-sm font-medium text-gray-700 mb-1">
                                Postal Code
                            </label>
                            <input
                                type="text"
                                id="shippingPostalCode"
                                name="shippingPostalCode"
                                placeholder="Enter Postal Code"
                                value={formData.shippingPostalCode}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="shippingCountry" className="block text-sm font-medium text-gray-700 mb-1">
                                Country
                            </label>
                            <input
                                type="text"
                                id="shippingCountry"
                                name="shippingCountry"
                                placeholder="Enter Country"
                                value={formData.shippingCountry}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="shippingPhone" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="shippingPhone"
                                name="shippingPhone"
                                placeholder="Enter Phone Number"
                                value={formData.shippingPhone}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Billing Details Section */}
                <div className="mb-6">
                    <div className="flex items-center mb-3">
                        <input
                            type="checkbox"
                            id="sameAddress"
                            checked={formData.useSameAddress}
                            onChange={handleSameAddressToggle}
                            className="mr-2"
                        />
                        <label htmlFor="sameAddress" className="text-sm font-medium text-gray-700">
                            Billing address same as shipping
                        </label>
                    </div>

                    {!formData.useSameAddress && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="billingFirstName" className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="billingFirstName"
                                    name="billingFirstName"
                                    placeholder="Enter First Name"
                                    value={formData.billingFirstName || customerProfile?.firstName || ''}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label htmlFor="billingLastName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="billingLastName"
                                    name="billingLastName"
                                    placeholder="Enter Last Name"
                                    value={formData.billingLastName || customerProfile?.lastName || ''}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="col-span-2">
                                <label htmlFor="billingStreet" className="block text-sm font-medium text-gray-700 mb-1">
                                    Street Address
                                </label>
                                <input
                                    type="text"
                                    id="billingStreet"
                                    name="billingStreet"
                                    placeholder="Enter Street Address"
                                    value={formData.billingStreet || customerProfile?.streetAddress || ''}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label htmlFor="billingCity" className="block text-sm font-medium text-gray-700 mb-1">
                                    City
                                </label>
                                <input
                                    type="text"
                                    id="billingCity"
                                    name="billingCity"
                                    placeholder="Enter City"
                                    value={formData.billingCity || customerProfile?.city || ''}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label htmlFor="billingState" className="block text-sm font-medium text-gray-700 mb-1">
                                    State/Province
                                </label>
                                <input
                                    type="text"
                                    id="billingState"
                                    name="billingState"
                                    placeholder="Enter State"
                                    value={formData.billingState || customerProfile?.state || ''}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label htmlFor="billingPostalCode" className="block text-sm font-medium text-gray-700 mb-1">
                                    Postal Code
                                </label>
                                <input
                                    type="text"
                                    id="billingPostalCode"
                                    name="billingPostalCode"
                                    placeholder="Enter Postal Code"
                                    value={formData.billingPostalCode || customerProfile?.postalCode || ''}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label htmlFor="billingCountry" className="block text-sm font-medium text-gray-700 mb-1">
                                    Country
                                </label>
                                <input
                                    type="text"
                                    id="billingCountry"
                                    name="billingCountry"
                                    placeholder="Enter Country"
                                    value={formData.billingCountry || customerProfile?.country || ''}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Contact Information */}
                <div className="mb-6">
                    <h2 className="text-lg font-medium mb-3">Contact Information</h2>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter Email Address"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                </div>

                {/* Payment Method Section */}
                <div className="mb-6">
                    <h2 className="text-lg font-medium mb-3">Payment Method</h2>
                    <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="CREDIT_CARD">Credit Card</option>
                        <option value="PAYPAL">PayPal</option>
                        <option value="STRIPE">Stripe</option>
                        <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
                    </select>

                    {formData.paymentMethod === 'CREDIT_CARD' && (
                        <div className="mt-4 space-y-4">
                            <div>
                                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                    Card Number
                                </label>
                                <input
                                    type="text"
                                    id="cardNumber"
                                    name="cardNumber"
                                    placeholder="1234 5678 9012 3456"
                                    value={formData.cardNumber}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                                        Expiry Date
                                    </label>
                                    <input
                                        type="text"
                                        id="cardExpiry"
                                        name="cardExpiry"
                                        placeholder="MM/YY"
                                        value={formData.cardExpiry}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="cardCVV" className="block text-sm font-medium text-gray-700 mb-1">
                                        CVV
                                    </label>
                                    <input
                                        type="text"
                                        id="cardCVV"
                                        name="cardCVV"
                                        placeholder="123"
                                        value={formData.cardCVV}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Name on Card
                                </label>
                                <input
                                    type="text"
                                    id="cardName"
                                    name="cardName"
                                    placeholder=""
                                    value={formData.shippingFirstName + " " + formData.shippingLastName}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                        </div>
                    )}

                    {formData.paymentMethod === 'PAYPAL' && (
                        <div className="mt-4 p-4 border border-gray-200 rounded bg-gray-50">
                            <p className="text-sm text-gray-700">You'll be redirected to PayPal to complete your payment.</p>
                        </div>
                    )}

                    {formData.paymentMethod === 'STRIPE' && (
                        <div className="mt-4 p-4 border border-gray-200 rounded bg-gray-50">
                            <p className="text-sm text-gray-700">You'll be redirected to Stripe to complete your payment.</p>
                        </div>
                    )}

                    {formData.paymentMethod === 'CASH_ON_DELIVERY' && (
                        <div className="mt-4 p-4 border border-gray-200 rounded bg-gray-50">
                            <p className="text-sm text-gray-700">You'll pay when your order is delivered.</p>
                        </div>
                    )}
                </div>

                <div className="mt-8">
                    <button
                        onClick={processPayment}
                        disabled={processingPayment}
                        className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                        {processingPayment ? 'Processing Payment...' : `Pay $${formatPrice(order?.totalPrice)}`}
                    </button>
                </div>
            </div>

            <div className="text-center mb-8">
                <button
                    onClick={() => router.back()}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                    Return to Cart
                </button>
            </div>
        </div>
    );
};

export default CheckoutPage;