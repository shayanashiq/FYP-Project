"use client";
import React, { useEffect } from "react";
import bgImg from "@/assets/images/login-bg.jpeg";
import ClientLoginForm from "@/components/registerForm";
import logo from "@/assets/imgs/white_logo.png";

export default function Home() {
  useEffect(() => {
    document.title = "Register - AVA Health";
    const metaDescription = document.querySelector("meta[name='description']");
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Register yourself on AVA Health"
      );
    } else {
      const newMetaDescription = document.createElement("meta");
      newMetaDescription.name = "description";
      newMetaDescription.content = "Register yourself on AVA Health";
      document.head.appendChild(newMetaDescription);
    }
  }, []);

  return (
    <div className="relative    grid grid-cols-1 md:grid-cols-2 bg-[#0c2540]">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url(${bgImg.src})`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      <section className="relative h-screen z-10 flex flex-col justify-center items-center md:items-center p-6  ">
        <div className="w-full text-center md:text-left space-y-2">
          <img
            src={logo.src}
            alt="AVA Health"
            className="w-[60%] md:w-1/3 object-contain mx-auto mb-8"
          />
          <h1 className="font-semibold text-[28px] md:text-[36px] lg:text-[45px] tracking-[-2%] text-center leading-[56.96px] text-white">
            <span className="whitespace-nowrap">
              Intelligence For Real-Life
            </span>{" "}
            <br /> Health Care
          </h1>
          <p className="text-white text-[14px] md:text-[18px] leading-[43.7px] text-center my-1">
            Get started - It’s Free.
          </p>
        </div>
        <div className="max-w-[400px] w-full">
          <ClientLoginForm />
        </div>

        <div className="w-full text-center text-white mt-5 space-y-2">
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
      <div className="hidden md:block"></div>
    </div>
  );
}
