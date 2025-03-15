"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login"); // Redirect to the login page
  }, [router]);

  return null; // Render nothing
};

export default LandingPage;
