"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Layout = ({ children }: any) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const {status} = useSession();
  const router = useRouter();
  const handleInviteClick = () => {
    setIsPopupOpen(true); // Open the popup when Invite Patient button is clicked
  };

  const closePopup = () => {
    setIsPopupOpen(false); // Close the popup
  };

  


  useEffect(() => {
    document.title = "Dashboard - AVA Health";
    const metaDescription = document.querySelector("meta[name='description']");
    if (metaDescription) {
      metaDescription.setAttribute("content", "Dashboard of AVA Health");
    } else {
      const newMetaDescription = document.createElement("meta");
      newMetaDescription.name = "description";
      newMetaDescription.content = "Dashboard of AVA Health";
      document.head.appendChild(newMetaDescription);
    }
  }, []);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInvitePopupOpen, setIsInvitePopupOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openInvitePopup = () => {
    setIsInvitePopupOpen(true);
  };

  const closeInvitePopup = () => {
    setIsInvitePopupOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row ">

      <button
        className="p-4 text-3xl absolute top-0 left-0 z-50 md:hidden"
        onClick={toggleSidebar}
      >
        ☰
      </button>

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        onInviteClick={openInvitePopup}
        onComingSoonClick={handleInviteClick} 
      />
      <div className="px-8">{children}</div>
    </div>
  );
};

export default Layout;