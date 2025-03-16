"use client";
import React, { useEffect } from "react";
// import bgImg from "@/assets/imgs/loginBg.png";
// import logo from "@/assets/imgs/white_logo.png";
import ClientPasswordForm from "@/components/loginForm";

export default function Home() {
  useEffect(() => {
    document.title = "Login - AVA Health";
    const metaDescription = document.querySelector("meta[name='description']");
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Login yourself on AVA Health"
      );
    } else {
      const newMetaDescription = document.createElement("meta");
      newMetaDescription.name = "description";
      newMetaDescription.content = "Login yourself on AVA Health";
      document.head.appendChild(newMetaDescription);
    }
  }, []);

  return (
    <div className="relative min-h-screen min-w-full grid grid-cols-1 md:grid-cols-2">
      {/* Content Section */}
      <section className="relative z-10 w-full h-full flex flex-col justify-center items-center px-4 space-y-6">
        <div className="flex flex-col justify-center items-center space-y-4">
          <img
            className="max-w-[250px] sm:max-w-[200px] md:max-w-[250px] w-full"
            src={"/assets/imgs/loginBg.png"}
            alt="AVA Health"
          />
          <div className="flex flex-col items-center space-y-2 text-center">
            <h1 className="font-[600] text-[#FFFFFF] text-[20px] sm:text-[24px] md:text-[36px] lg:text-[46px] leading-tight md:leading-[56.96px] tracking-[-2%] font-custom whitespace-nowrap">
              Welcome To AVA ONE 
            </h1>
            <p className="text-[#FFFFFF] text-[14px] sm:text-lg lg:text-[18px] leading-snug sm:leading-[24px] lg:leading-[43.7px] tracking-[-2%] font-normal">
              Get started - it’s free. No credit card needed.
            </p>
          </div>
        </div>
        <div className="max-w-[300px] sm:max-w-[360px] w-full">
          <ClientPasswordForm />
        </div>
      </section>

      {/* Placeholder for the second column (hidden on smaller screens) */}
      <div className="hidden md:block"></div>
    </div>
  );
}
