"use client";

import React from 'react';
import { useCart } from './context/CartContext';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  images: string[];
  price: number;
  discount?: number;
  stock: number;
}

interface CartItem {
  id: string;
  quantity: number;
  product: Product;
  productId: string;
}

interface Cart {
  id: string;
  userId: string | null;
  items: CartItem[];
}

const CartSidebar = () => {
  const { isCartOpen, closeCart } = useCart();
  const { data: session } = useSession();
  const [cart, setCart] = React.useState<Cart | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const userId = session?.user?.id;
        const guestCartId = localStorage.getItem('guestCartId');

        if (!userId && !guestCartId) {
          setCart({ id: '', userId: null, items: [] });
          return;
        }

        const response = await fetch(`/api/cart?${userId ? `userId=${userId}` : `guestCartId=${guestCartId}`}`);
        
        if (!response.ok) throw new Error('Failed to fetch cart');
        
        const { data, cartId, isGuestCart } = await response.json();
        
        const cartData = data || {
          id: cartId || '',
          userId: userId || null,
          items: []
        };
        
        setCart(cartData);
        
        if (isGuestCart && cartId && !guestCartId) {
          localStorage.setItem('guestCartId', cartId);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load cart');
      } finally {
        setLoading(false);
      }
    };

    if (isCartOpen) {
      fetchCart();
    }
  }, [isCartOpen, session?.user?.id]);

  const removeItem = async (itemId: string) => {
    try {
      const userId = session?.user?.id;
      const guestCartId = localStorage.getItem('guestCartId');

      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userId ? { userId } : { guestCartId }),
      });

      if (!response.ok) throw new Error('Failed to remove item');
      
      if (cart) {
        setCart({
          ...cart,
          items: cart.items.filter(item => item.id !== itemId)
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item');
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    try {
      const userId = session?.user?.id;
      const guestCartId = localStorage.getItem('guestCartId');

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(userId ? { userId } : { guestCartId }),
          productId,
          quantity: newQuantity
        }),
      });

      if (!response.ok) throw new Error('Failed to update quantity');
      
      if (cart) {
        setCart({
          ...cart,
          items: cart.items.map(item => 
            item.productId === productId 
              ? { ...item, quantity: newQuantity } 
              : item
          )
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update quantity');
    }
  };

  const calculateDiscountedPrice = (price: number, discount?: number) => {
    if (!discount) return price;
    return price * (1 - discount / 100);
  };

  const calculateTotal = () => {
    if (!cart?.items.length) return 0;
    return cart.items.reduce((total, item) => {
      const discountedPrice = calculateDiscountedPrice(item.product.price, item.product.discount);
      return total + (discountedPrice * item.quantity);
    }, 0);
  };

  return (
    <>
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeCart}
        />
      )}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-2/5 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold">Your Cart</h2>
            <button 
              onClick={closeCart}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 p-4">{error}</div>
            ) : !cart || cart.items.length === 0 ? (
              <div className="text-center py-8">
                <p>Your cart is empty</p>
                <button 
                  onClick={() => {
                    closeCart();
                    router.push('/products');
                  }}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.items.map((item) => {
                  const discountedPrice = calculateDiscountedPrice(item.product.price, item.product.discount);
                  const originalTotal = item.product.price * item.quantity;
                  const discountedTotal = discountedPrice * item.quantity;
                  
                  return (
                    <div key={item.id} className="flex items-start border-b pb-4">
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <div className="flex items-center mt-1">
                          <span className="text-gray-900 font-medium">
                            £{discountedTotal.toFixed(2)}
                          </span>
                          {item.product.discount && (
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              £{originalTotal.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center mt-2">
                          <button
                            onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                            className="w-8 h-8 border rounded flex items-center justify-center"
                          >
                             -
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-8 h-8 border rounded flex items-center justify-center"
                            disabled={item.quantity >= item.product.stock}
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-4 text-red-500 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                        {item.product.discount && (
                          <div className="mt-1 text-sm text-green-600">
                            You save £{(originalTotal - discountedTotal).toFixed(2)} ({item.product.discount}% off)
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {cart?.items.length && cart?.items.length > 0 && (
            <div className="border-t p-4">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Subtotal</span>
                <span className="font-bold">£{calculateTotal().toFixed(2)}</span>
              </div>
              <button
                onClick={() => {
                  closeCart();
                  router.push('/checkout');
                }}
                className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={() => {
                  closeCart();
                  router.push('/cart');
                }}
                className="w-full mt-2 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                View Full Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;