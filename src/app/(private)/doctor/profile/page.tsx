"use client";
import React from "react";
import ProfileDetailsForm from "@/components/profileForm";
import { useEffect } from "react";

export default function ProfileDetails() {
  useEffect(() => {
    document.title = "Profile - AVA Health";
    const metaDescription = document.querySelector("meta[name='description']");
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Setup your profile on AVA Health"
      );
    } else {
      const newMetaDescription = document.createElement("meta");
      newMetaDescription.name = "description";
      newMetaDescription.content = "Setup your profile on AVA Health";
      document.head.appendChild(newMetaDescription);
    }
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col lg:flex-row mt-0 pt-0 overflow-x-hidden bg-gray-100">
      <section className="w-full lg:w-[60vw] h-auto flex flex-col justify-center items-center p-6 space-y-8 lg:space-y-1">
        <img
          src={logo.src}
          alt="AVA One"
          className="h-[60px] md:h-[85px] lg:h-[100px] w-full max-w-[500px] object-contain mb-4"
        />
        <ProfileDetailsForm />
      </section>
      <div className="hidden  lg:flex lg:w-[40vw] h-screen flex-col">
        <img
          src={backgroungImg.src}
          alt="Profile Page"
          className="w-full h-[100vh] object-cover rounded-l-[90px]"
        />
      </div>
    </div>
  );
}
