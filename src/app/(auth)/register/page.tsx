"use client";
import React, { useEffect } from "react";
import bgImg from "@/assets/myImages/bg.jpg";
import ClientLoginForm from "@/components/registerForm";
import Image from "next/image";

export default function Home() {
  useEffect(() => {
    document.title = "Register - Daily Kart";
    const metaDescription = document.querySelector("meta[name='description']");
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Register yourself on Daily Kart"
      );
    } else {
      const newMetaDescription = document.createElement("meta");
      newMetaDescription.name = "description";
      newMetaDescription.content = "Register yourself on Daily Kart";
      document.head.appendChild(newMetaDescription);
    }
  }, []);

  return (
    <div className="relative    grid grid-cols-1 md:grid-cols-2">


      <section className="relative h-screen z-10 flex flex-col justify-center items-center md:items-center p-6  ">
        <div className="w-full text-center md:text-left space-y-2">

          <h1 className="font-semibold text-[28px] md:text-[32px] lg:text-[40px] tracking-[-2%] text-center leading-[56.96px] text-black">
            <span className="whitespace-nowrap">
              Browse deals on <br />Top Quality Products
            </span>
          </h1>
          <p className="text-black text-[14px] md:text-[18px] leading-[43.7px] text-center my-1">
            Get started - It’s Free.
          </p>
        </div>
        <div className="max-w-[400px] w-full">
          <ClientLoginForm />
        </div>

        <div className="w-full text-center text-black mt-5 space-y-2">
          <p className="text-sm md:text-[15.28px] leading-[20.78px]">
            By Proceeding, You Agree To The <br />
            <a href="#" className="text-blue-500">
              Terms of Service
            </a>{" "}
            And{" "}
            <a href="#" className="text-blue-500">
              Privacy Policy
            </a>
          </p>

          <p className="text-sm md:text-[15.28px] leading-[25.48px]">
            Already Have An Account?{" "}
            <a href="./login" className="text-blue-500 font-medium">
              Log in
            </a>
          </p>
        </div>
      </section>
      <Image
        src={bgImg.src}
        height={100}
        width={100}
        alt="bg"
        className="w-[100%]"
      />
      <div className="hidden md:block"></div>
    </div>
  );
}
