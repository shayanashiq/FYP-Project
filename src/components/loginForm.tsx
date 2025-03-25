"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import * as Yup from "yup";
import { signIn, useSession } from "next-auth/react";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import googleLogo from "../assets/images/google-logo.png";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

function ClientLoginForm() {
  const { data: session, status }:any = useSession();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const emailFromParams = searchParams?.get("email") || "";
  const from = searchParams?.get("from");
  const [loading, setLoading] = useState(true);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (status !== "loading") {
      setLoading(false);
    }
  }, [status]);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: from || "/"
      });
  
      if (result?.error) {
        toast.error("Failed to sign in with Google");
      } else {
        // Check the user role after Google sign-in
        const session = await fetch("/api/auth/session");
        const sessionData = await session.json();
        
        if (sessionData?.user?.role === "ADMIN") {
          router.push("/admin");
        } else if (sessionData?.user?.role === "VENDOR") {
          router.push("/vendor"); // Add this if vendors have a specific page
        } else {
          router.push("/"); // Default for customers
        }
      }
    } catch (error) {
      toast.error("Error signing in with Google");
    }
  }; 

  const callbackUrl = from || session?.user?.role === "CUSTOMER"
    ? "/"
    : session?.user?.role === null &&
      session?.user?.token &&
      session?.user?.isPasswordSet === false &&
      session?.user?.isProfileComplete === false
    ? `/password?email=${encodeURIComponent(session?.user?.email)}`
    : session?.user?.role === null &&
      session?.user?.isPasswordSet === true &&
      session?.user?.isProfileComplete === false &&
      session?.user?.token
    ? `/doctor/profile?email=${encodeURIComponent(session?.user?.email)}`
    : "/login";

  return (
    <div className="w-full">
      <Formik
        initialValues={{
          email: emailFromParams || "",
          password: "",
        }}
        validationSchema={LoginSchema}
        validateOnChange={true}
        validateOnBlur={false}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const result = await signIn("credentials", {
              redirect: false,
              email: values.email,
              password: values.password,
              isSettingPassword: "false",
              callbackUrl: "/",
            });
            setSubmitting(false);
        
            if (result?.error) {
              toast.error("Error", {
                description: result?.error || "🚨Oops... Something went wrong!",
              });
            } else {
              // Instead of hardcoding the redirect to "/"
              // Get the current session to check the user role
              const session = await fetch("/api/auth/session");
              const sessionData = await session.json();
              
              if (sessionData?.user?.role === "ADMIN") {
                router.push("/admin");
              } else if (sessionData?.user?.role === "VENDOR") {
                router.push("/vendor"); // Add this if vendors have a specific page
              } else {
                router.push("/"); // Default for customers
              }
            }
          } catch (err) {
            toast.error("Error", {
              description: "🚨Oops... Something went wrong!",
            });
          }
        }}
      >
        {({ errors, touched, isSubmitting, handleSubmit }) => (
          <Form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col relative w-full space-y-1 font-custom">
              <div className="my-2">
                <label
                  htmlFor="email"
                  className="text-black font-semibold text-sm mb-2 block leading-[13.7px] -tracking-3"
                >
                  Email <span className="text-red-500">*</span>
                </label>

                <Field
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  className={`h-[42px] mb-[2px] py-4 px-6 rounded-[6.56px] border-blue-300 border-[0.51px] w-full text-sm :focus:ring-0 ring-0 outline-none ${
                    errors.email && touched.email
                      ? "border-red-500"
                      : "border-blue-300"
                  }`}
                />
                {errors?.email && touched?.email && (
                  <p className="text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="relative my-2">
                <label
                  htmlFor="password"
                  className="text-black font-semibold text-sm block mb-2 leading-[13.7px] -tracking--10"
                >
                  Password <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <Field
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className={`h-[42px] mb-[2px] py-4 px-6 rounded-[6.56px] border-[0.51px] border-blue-300 w-full text-sm :focus:ring-0 ring-0 outline-none ${
                      errors.password && touched.password
                        ? "border-red-500"
                        : "border-blue-300"
                    }`}
                  />
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-6 w-6 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                </div>
                {errors.password && touched.password && (
                  <p className="text-red-500">{errors.password}</p>
                )}
              </div>

              <div onClick={() => router.push("/forget-password")}>
                <p className="py-2 text-xs underline text-right font-medium leading-[13.7px] cursor-pointer text-black">
                  Forget Password?
                </p>
              </div>

              <button
                type="submit"
                className={`bg-[#F19B12] rounded-md text-base font-medium text-white py-2 ${
                  isSubmitting || loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting || loading}
              >
                {loading ? "Loading..." : isSubmitting ? "Logging in..." : "Login"}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <div className="py-3 flex items-center justify-center">
        <div className="border-t-[1px] border-solid border-black flex-grow"></div>
        <span className="mx-2 text-black text-base font-normal">Or</span>
        <div className="border-t-[1px] border-solid border-black flex-grow"></div>
      </div>

      <button
        onClick={handleGoogleSignIn}
        className="flex justify-center py-2 w-full bg-white font-custom text-base font-normal text-black border-[#F19B12] border-2"
      >
        <Image
          width={50}
          height={50}
          src={googleLogo.src}
          alt="Google Logo"
          className="w-6 h-6 mr-2"
        />
        <div className="text-black">Continue with Google</div>
      </button>

      <p className="text-center text-black leading-[25.48px] pt-3">
        Do not have an account?{" "}
        <Link
          href="./register"
          className="text-black cursor-pointer text-base font-normal"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}

export default function LoginForm() {
  return <ClientLoginForm />;
}
