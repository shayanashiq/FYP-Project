"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/assets/images/ava-logo.png"

const Page = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false)  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setMessage("");
    setError("");
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
        setLoading(true)
      const response = await fetch("/api/request-account-deletion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage(result.message || "OTP sent successfully!");
        router.push(
            `./deletion?email=${encodeURIComponent(
              email.toString()
            )}`
          );
      } else {
        setError(result.message || "Failed to send OTP.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
    finally{
        setLoading(false)

    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSendOTP}
        className="w-[90%] lg:w-[40%]"
      >
        <div className="flex items-center justify-center">
        <Image
        src = {logo.src}
        width={300}
        height={1000}
        alt="Ava Logo"
        className=" w-100 h-50"
        />
        </div>
        <h1 className=" text-[28px] md:text-[36px] lg:text-[30px] tracking-[-2%] text-center leading-[40.96px] ">Enter Email address to request your account deletion</h1>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        <span className="text-red-500">*</span></label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={handleEmailChange}
          className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email"
          required
        />
        <button
          type="submit"
          className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          {loading ? "Sending Otp..." : "Send Otp"}
        </button>
        {message && <p className="mt-4 text-green-600">{message}</p>}
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </form>
    </div>
  );
};

export default Page;
