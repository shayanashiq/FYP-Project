// app/account/checkout/page.tsx
"use client"

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

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
}

const CheckoutPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!session?.user?.id || !orderId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/orders/${orderId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch order');
        }
        
        const { data } = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while loading your order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [session, orderId]);

  // Format price safely with fallback
  const formatPrice = (price: number | string | null | undefined): string => {
    if (price === null || price === undefined) return "0.00";
    
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    if (isNaN(numPrice)) return "0.00";
    
    return numPrice.toFixed(2);
  };

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentMethod(e.target.value);
  };

  const processPayment = async () => {
    if (!session?.user?.id || !order) return;
    
    try {
      setProcessingPayment(true);
      setError(null);
      
      // Update the order with payment method
      const response = await fetch(`/api/orders/${order.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethod,
          status: 'CONFIRMED', // Update order status
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment processing failed');
      }
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // subtract the no of items from the total stock ty and update db
      
      
      // Redirect to order confirmation
      router.push(`/account/orders/confirmation?orderId=${order.id}`);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment processing failed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading checkout...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4 bg-red-50 rounded">{error}</div>;
  }

  if (!order) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold mb-4">Order Not Found</h2>
        <p className="text-gray-600 mb-4">The order you're looking for doesn't exist or you don't have permission to view it.</p>
        <button 
          onClick={() => router.push('/products')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-semibold mb-6">Checkout</h1>
        
        {error && <div className="text-red-500 p-2 mb-4 bg-red-50 rounded">{error}</div>}
        
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
                {order.items.map((item) => (
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
                  <td className="px-4 py-3 text-right font-semibold">${formatPrice(order.totalPrice)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-3">Payment Method</h2>
          <select
            value={paymentMethod}
            onChange={handlePaymentMethodChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="CREDIT_CARD">Credit Card</option>
            <option value="PAYPAL">PayPal</option>
            <option value="STRIPE">Stripe</option>
            <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
          </select>
          
          {paymentMethod === 'CREDIT_CARD' && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input 
                  type="text" 
                  placeholder="1234 5678 9012 3456"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input 
                    type="text" 
                    placeholder="MM/YY"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input 
                    type="text" 
                    placeholder="123"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name on Card
                </label>
                <input 
                  type="text" 
                  placeholder="John Doe"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
            </div>
          )}
          
          {paymentMethod === 'PAYPAL' && (
            <div className="mt-4 p-4 border border-gray-200 rounded bg-gray-50">
              <p className="text-sm text-gray-700">You'll be redirected to PayPal to complete your payment.</p>
            </div>
          )}
          
          {paymentMethod === 'STRIPE' && (
            <div className="mt-4 p-4 border border-gray-200 rounded bg-gray-50">
              <p className="text-sm text-gray-700">You'll be redirected to Stripe to complete your payment.</p>
            </div>
          )}
          
          {paymentMethod === 'CASH_ON_DELIVERY' && (
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
            {processingPayment ? 'Processing Payment...' : `Pay $${formatPrice(order.totalPrice)}`}
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