"use client";
import React from "react";
import ResetPassword from "@/components/resetPassword/resetPassword";
import Image from "next/image";

import PasswordPic from "@/assets/images/reset-password.png";
import logo from "@/assets/images/ava-logo.png";
import { useEffect } from "react";

export default function Password() {
  useEffect(() => {
    document.title = "Password - AVA Health";
    const metaDescription = document.querySelector("meta[name='description']");
    if (metaDescription) {
      metaDescription.setAttribute("content", "Password setup for AVA Health");
    } else {
      const newMetaDescription = document.createElement("meta");
      newMetaDescription.name = "description";
      newMetaDescription.content = "Password setup for AVA Health";
      document.head.appendChild(newMetaDescription);
    }
  }, []);

  return (
    <div className="h-screen w-screen px-4 flex flex-col justify-center lg:flex-row mt-0 pt-0 overflow-x-hidden bg-gray-100 font-custom">
      <section className="w-full lg:w-[60vw] h-auto flex flex-col justify-center items-center">
        <Image
        width={500}
        height={500}
          src={logo.src}
          alt="AVA Health"
          className="h-[70px] md:h-[85px] lg:h-[120px] w-[600px] max-w-[600px] object-contain"
        />
        <div className="flex flex-col items-center space-y-1 lg:space-y-1 pb-12 pt-8 ">
          <h1 className="font-semibold leading-[56.96px] bold text-[24px] md:text-[36px] lg:text-[46px] text-center font-custom -tracking--2">
            Reset Password
          </h1>
          <p className="md:text-lg lg:text-[18px] leading-[43.7px] tracking-[-2%] font-normal text-center decoration-0 text-[#696969]">
              Create a new password to restore your account.
            </p>
        </div>

        <ResetPassword />
      </section>
      <div className="hidden lg:flex lg:w-[40vw] h-screen flex-col">
        <Image
        width={500}
        height={500}
          src={PasswordPic.src}
          alt="Verification"
          className="w-full h-[100vh] object-cover rounded-l-[90px]"
        />
      </div>
    </div>
  );
}




