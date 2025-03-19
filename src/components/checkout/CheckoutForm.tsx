// components/checkout/CheckoutForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';

export default function CheckoutForm({ onSubmit, isLoading }: any) {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [shippingMethod, setShippingMethod] = useState('standard');
    const paymentMethod = watch('paymentMethod', 'card');

    const handleFormSubmit = (data: any) => {
        // Add shipping method to form data
        data.shippingMethod = shippingMethod;
        onSubmit(data);
    };

    return (
        <form id="checkout-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
            {/* Shipping Information Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            id="fullName"
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            {...register('fullName', { required: 'Full name is required' })}
                        />
                        {errors.fullName?.message && (
                            <p className="text-red-500 text-sm mt-1">{String(errors.fullName.message)}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-1">
                            Address Line 1
                        </label>
                        <input
                            id="addressLine1"
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            {...register('addressLine1', { required: 'Address is required' })}
                        />
                        {errors.addressLine1?.message && (
                            <p className="text-red-500 text-sm mt-1">{String(errors.addressLine1.message)}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-1">
                            Address Line 2 (Optional)
                        </label>
                        <input
                            id="addressLine2"
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            {...register('addressLine2')}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                City
                            </label>
                            <input
                                id="city"
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                {...register('city', { required: 'City is required' })}
                            />
                            {errors.city?.message && (
                                <p className="text-red-500 text-sm mt-1">{String(errors.city.message)}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                                State/Province
                            </label>
                            <input
                                id="state"
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                {...register('state', { required: 'State is required' })}
                            />
                            {errors.state?.message && (
                                <p className="text-red-500 text-sm mt-1">{String(errors.state.message)}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                                Postal Code
                            </label>
                            <input
                                id="postalCode"
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                {...register('postalCode', { required: 'Postal code is required' })}
                            />
                            {errors.postalCode?.message && (
                                <p className="text-red-500 text-sm mt-1">{String(errors.postalCode.message)}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                                Country
                            </label>
                            <select
                                id="country"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                {...register('country', { required: 'Country is required' })}
                            >
                                <option value="">Select Country</option>
                                <option value="US">United States</option>
                                <option value="CA">Canada</option>
                                <option value="UK">United Kingdom</option>
                                {/* Add more countries as needed */}
                            </select>
                            {errors.country?.message && (
                                <p className="text-red-500 text-sm mt-1">{String(errors.country.message)}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Shipping Method Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>

                <div className="space-y-4">
                    <div className="flex items-center">
                        <input
                            id="standard-shipping"
                            type="radio"
                            name="shippingMethod"
                            value="standard"
                            checked={shippingMethod === 'standard'}
                            onChange={() => setShippingMethod('standard')}
                            className="h-4 w-4 text-blue-600"
                        />
                        <label htmlFor="standard-shipping" className="ml-2 block text-sm font-medium text-gray-700">
                            Standard Shipping ($5.00) - 3-5 business days
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            id="express-shipping"
                            type="radio"
                            name="shippingMethod"
                            value="express"
                            checked={shippingMethod === 'express'}
                            onChange={() => setShippingMethod('express')}
                            className="h-4 w-4 text-blue-600"
                        />
                        <label htmlFor="express-shipping" className="ml-2 block text-sm font-medium text-gray-700">
                            Express Shipping ($15.00) - 1-2 business days
                        </label>
                    </div>
                </div>
            </div>

            {/* Payment Method Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

                <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <input
                                id="card-payment"
                                type="radio"
                                value="card"
                                {...register('paymentMethod', { required: true })}
                                className="h-4 w-4 text-blue-600"
                            />
                            <label htmlFor="card-payment" className="ml-2 block text-sm font-medium text-gray-700">
                                Credit/Debit Card
                            </label>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="paypal-payment"
                                type="radio"
                                value="paypal"
                                {...register('paymentMethod', { required: true })}
                                className="h-4 w-4 text-blue-600"
                            />
                            <label htmlFor="paypal-payment" className="ml-2 block text-sm font-medium text-gray-700">
                                PayPal
                            </label>
                        </div>
                    </div>

                    {paymentMethod === 'card' && (
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                    Card Number
                                </label>
                                <input
                                    id="cardNumber"
                                    type="text"
                                    placeholder="1234 1234 1234 1234"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    {...register('cardNumber', {
                                        required: 'Card number is required',
                                        pattern: {
                                            value: /^[0-9]{16}$/,
                                            message: 'Please enter a valid 16-digit card number'
                                        }
                                    })}
                                />
                                {errors.cardNumber?.message && (
                                    <p className="text-red-500 text-sm mt-1">{String(errors.cardNumber.message)}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                                        Expiry Date (MM/YY)
                                    </label>
                                    <input
                                        id="cardExpiry"
                                        type="text"
                                        placeholder="MM/YY"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        {...register('cardExpiry', {
                                            required: 'Expiry date is required',
                                            pattern: {
                                                value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                                                message: 'Please enter a valid expiry date (MM/YY)'
                                            }
                                        })}
                                    />
                                    {errors.cardExpiry?.message && (
                                        <p className="text-red-500 text-sm mt-1">{String(errors.cardExpiry.message)}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="cardCvc" className="block text-sm font-medium text-gray-700 mb-1">
                                        CVC
                                    </label>
                                    <input
                                        id="cardCvc"
                                        type="text"
                                        placeholder="123"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        {...register('cardCvc', {
                                            required: 'CVC is required',
                                            pattern: {
                                                value: /^[0-9]{3,4}$/,
                                                message: 'Please enter a valid CVC'
                                            }
                                        })}
                                    />
                                    {errors.cardCvc?.message && (
                                        <p className="text-red-500 text-sm mt-1">{String(errors.cardCvc.message)}</p>
                                    )}

                                </div>
                            </div>
                        </div>
                    )}

                    {paymentMethod === 'paypal' && (
                        <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-sm text-gray-600">
                                You will be redirected to PayPal to complete your payment after reviewing your order.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
}


