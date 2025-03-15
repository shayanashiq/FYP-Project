"use client";
import React, { useEffect, useState } from "react";

const Connect = () => {
  const [token, setToken] = useState<string | null>(null);

  const handleRedirect = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      console.log("Token is not available in the URL");
    }
  };

  useEffect(() => {
    if (token) {
      console.log("Redirecting with token:", token);
      redirectUser(token);
    }
  }, [token]);

  const redirectUser = (token: string) => {
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isAndroid) {
      const androidLink = `avahealth://reset-password?token=${token}#Intent;scheme=https;package=com.avahealth.buildmeapp;end`;
      window.location.href = androidLink;

      setTimeout(() => {
        window.location.href = `https://play.google.com/store/apps/details?id=com.avahealth.buildmeapp`;
      }, 1500);
    } else if (isIOS) {
      window.location.href = `https://app.avahealth.ai/reset-password?token=${token}`;
      setTimeout(() => {
        window.location.href = "https://apps.apple.com/us/app/id1234567890";
      }, 1500);
    } else {
      window.location.href = `https://app.avahealth.ai/reset-password?token=${token}`;
    }
  };

  useEffect(() => {
    handleRedirect();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-[44px] text-[#000]">Reset Password</h1>
      <button
        onClick={handleRedirect}
        style={{
          padding: "10px 20px",
          backgroundColor: "blue",
          color: "white",
          borderRadius: "5px",
        }}
      >
        Open in App
      </button>
    </div>
  );
};

export default Connect;



