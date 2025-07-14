"use client"; // Ensures this is a client component

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const CountdownTimer: React.FC = () => {
  const SearchParams: any = useSearchParams();
  const email = SearchParams.get("email");

  const [isDisabled, setIsDisabled] = useState(true);
  const [timer, setTimer] = useState(120);

  useEffect(() => {
    if (isDisabled) {
      const countdown = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      if (timer === 0) {
        setIsDisabled(false);
      }

      return () => clearInterval(countdown);
    }
  }, [timer, isDisabled]);

  const handleResendClick = async () => {
    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      if (response.ok) {
        const result = await response.json();
      }
    } catch (error) {
      throw new Error("Error resending OTP");
    }

    setTimer(120);
    setIsDisabled(true);
  };

  return (
    <div className="text-center py-5">
      <p className="text-black font-custom text-xl">
        Didn’t receive the code?{" "}
        <button
          onClick={handleResendClick}
          disabled={isDisabled}
          className={`underline font-extrabold ${
            isDisabled ? "text-gray-400 cursor-not-allowed" : "text-black"
          }`}
        >
          Resend Code {isDisabled && `(${timer}s)`}
        </button>
      </p>
    </div>
  );
};

export default CountdownTimer;
