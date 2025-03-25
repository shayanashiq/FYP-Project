"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Order } from "@/types/order";

export default function Orders() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [activeTab, setActiveTab] = useState("orders");
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (status === "authenticated" && activeTab === "orders") {
            fetchOrders();
        }
    }, [status, activeTab]);

    const fetchOrders = async () => {
        if (!session?.user.id) return;

        setIsLoading(true);
        try {
            const response = await fetch(`/api/orders?userId=${session.user.id}`);
            const result = await response.json();

            if (response.ok) {
                setOrders(result.data);
            } else {
                console.error("Failed to fetch orders");
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (status === "loading") {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (status === "unauthenticated") {
        router.push("/login");
        return null;
    }

    const profile = session?.user.customerProfile || {};

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Tab Navigation remains the same as before */}
            <div className="bg-gray-100 p-4 flex border-b">
                <button
                    onClick={() => router.push("/account")}
                    className={`mr-4 py-2 px-4 rounded-t ${activeTab === "profile" ? "bg-white border-t border-l border-r font-bold" : ""}`}
                >
                    Profile
                </button>
                <button
                    className={`mr-4 py-2 px-4 rounded-t ${activeTab === "orders" ? "bg-white border-t border-l border-r font-bold" : ""}`}
                >
                    My Orders
                </button>
                <button
                    onClick={() => router.push("/account/wishlist")}
                    className={`mr-4 py-2 px-4 rounded-t ${activeTab === "wishlist" ? "bg-white border-t border-l border-r font-bold" : ""}`}
                >
                    Wishlist
                </button>
            </div>

            {/* Content Area */}
            <div className="bg-white p-6 rounded-b-lg border border-grey-200">
                {/* Existing Profile and Wishlist tabs remain the same */}

                <div>
                    <h2 className="text-xl font-bold mb-4">My Orders</h2>
                    {isLoading ? (
                        <div className="text-center">Loading orders...</div>
                    ) : orders.length === 0 ? (
                        <div className="border rounded-lg overflow-hidden">
                            <div className="p-6 text-center">
                                <p className="text-gray-500">You haven't placed any orders yet.</p>
                                <Link href="/" className="mt-4 inline-block bg-orange-500 text-white py-2 px-6 rounded">
                                    Start Shopping
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order.id} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <p className="font-bold">Order #{order.id.slice(-6)}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
                                            {order.status}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex items-center">
                                                {item.product.images && item.product.images.length > 0 ? (
                                                    <Image
                                                        src={item.product.images[0]}
                                                        alt={item.product.name}
                                                        width={64}
                                                        height={64}
                                                        className="w-16 h-16 object-cover mr-4"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 bg-gray-200 mr-4 flex items-center justify-center">
                                                        No Image
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium">{item.product.name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        SKU: {item.product.sku} | Quantity: {item.quantity}
                                                    </p>
                                                    <p className="text-sm font-semibold">
                                                        ${(item.price * item.quantity)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 text-right">
                                        <p className="text-lg font-bold">
                                            Total: ${order.totalPrice}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}