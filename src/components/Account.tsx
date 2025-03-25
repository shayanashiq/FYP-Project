"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Account() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [activeTab, setActiveTab] = useState("profile");

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

            {/* Tab Navigation */}
            <div className="bg-gray-100 p-4 flex border-b">
                <button
                    className={`mr-4 py-2 px-4 rounded-t ${activeTab === "profile" ? "bg-white border-t border-l border-r font-bold" : ""}`}
                >
                    Profile
                </button>
                <button
                    onClick={() => router.push("/account/orders")}
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
                    <div>
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/3 mb-6 md:mb-0 pr-0 md:pr-6">
                                <div className="bg-gray-100 p-6 rounded-lg text-center">
                                    <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden border">
                                        {profile.imageUrl ? (
                                            <Image
                                                src={profile.imageUrl}
                                                alt="Profile Picture"
                                                width={128}
                                                height={128}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-blue-800 text-white text-4xl">
                                                {profile.firstName ? profile.firstName.charAt(0) : ""}
                                                {profile.lastName ? profile.lastName.charAt(0) : ""}
                                            </div>
                                        )}
                                    </div>

                                    <h2 className="text-xl font-bold">
                                        {profile.firstName} {profile.lastName}
                                    </h2>
                                    <p className="text-gray-600">{session?.user.email}</p>
                                    <div className="mt-4">
                                        <button className="bg-blue-800 text-white py-2 px-4 rounded hover:bg-blue-900">
                                            Edit Profile
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="md:w-2/3">
                                <h2 className="text-xl font-bold mb-4">Personal Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="border p-4 rounded">
                                        <p className="text-gray-500 text-sm">Full Name</p>
                                        <p className="font-medium">{profile.firstName} {profile.lastName}</p>
                                    </div>
                                    <div className="border p-4 rounded">
                                        <p className="text-gray-500 text-sm">Contact</p>
                                        <p className="font-medium">{profile.phone || "Not provided"}</p>
                                    </div>
                                    <div className="border p-4 rounded">
                                        <p className="text-gray-500 text-sm">Email</p>
                                        <p className="font-medium">{session?.user.email}</p>
                                    </div>
                                    <div className="border p-4 rounded">
                                        <p className="text-gray-500 text-sm">Member Since</p>
                                        <p className="font-medium">March 2025</p>
                                    </div>
                                </div>

                                <h2 className="text-xl font-bold mt-6 mb-4">Address Information</h2>
                                <div className="border p-4 rounded">
                                    <div className="flex justify-between">
                                        <h3 className="font-medium">Delivery Address</h3>
                                        <button className="text-blue-800 hover:underline">Edit</button>
                                    </div>
                                    <p className="mt-2">
                                        {profile.address || "No address provided"},<br />
                                        {profile.city || ""}{profile.city && profile.zipCode ? ", " : ""}{profile.zipCode || ""}<br />
                                        {profile.country || ""}
                                    </p>
                                </div>

                                <div className="mt-6">
                                    <h2 className="text-xl font-bold mb-4">Account Settings</h2>
                                    <div className="space-y-3">
                                        <button className="w-full text-left flex justify-between items-center border p-4 rounded hover:bg-gray-50">
                                            <span>Change Password</span>
                                            <span>→</span>
                                        </button>
                                        <button className="w-full text-left flex justify-between items-center border p-4 rounded hover:bg-gray-50">
                                            <span>Communication Preferences</span>
                                            <span>→</span>
                                        </button>
                                        <button className="w-full text-left flex justify-between items-center border p-4 rounded hover:bg-gray-50 text-red-600">
                                            <span>Delete Account</span>
                                            <span>→</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                
            </div>
        </div>
    );
}