"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Account() {
    const router = useRouter();
    const { data: session, status } = useSession();



    return (
        <>
            <div>
                Name: {session?.user.customerProfile.firstName}
                {session?.user.customerProfile.lastName}
            </div>
            <div>
                Contact: {session?.user.customerProfile.phone}
            </div>
            <div>
                Address: {session?.user.customerProfile.address}
            </div>
            <div>
                City: {session?.user.customerProfile.city}
            </div>
            <div>
                Country: {session?.user.customerProfile.country}
            </div>
            <div>
                Zip Code: {session?.user.customerProfile.zipCode}
            </div>
        </>
    );
}