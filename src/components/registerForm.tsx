"use client";

import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import googleLogo from "../assets/images/google-logo.png";
import { sendOtp } from "@/lib/actions/auth";
import { toast } from "sonner";
import { Loader } from "@/components/shared/loader";

function validateEmail(value: string) {
  let error;
  if (!value) {
    error = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    error = "Invalid email address";
  }
  return error;
}

export default function ClientLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  const handleGoogleSignUp = async () => {
    try {
      const response = await fetch(`/api/google/signup`);
      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No auth URL received");
      }
    } catch (error) {
      toast.error("Failed to sign up with Google");
    }
  };

  return (
    <div className="w-full">
      <Formik
        initialValues={{
          email: "",
        }}
        validate={(values) => {
          const errors: { email?: string } = {};
          const emailError = validateEmail(values.email);
          if (emailError) {
            errors.email = emailError;
          }
          return errors;
        }}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          setError("");
          const emailError = validateEmail(values.email);
          <Loader />;
          if (emailError) {
            setErrors({ email: emailError });
            setSubmitting(false);
            return;
          }

          try {
            const response: any = await sendOtp({
              email: values.email,
            });
            setEmail(values.email);

            if (response?.status === 200) {
              toast.success(response.message || "OTP sent!");
              router.push(
                `./verification?email=${encodeURIComponent(
                  values.email.toString()
                )}`
              );
            }
          } catch (err: any) {
            if (
              err?.response?.data?.message ===
              "Verified user found with this email"
            ) {
              toast.success("Verified user found, redirecting to login.");
              router.push(`/login?email=${encodeURIComponent(values.email)}`);
            } else {
              toast.error(err?.message || "🚨Oops... Something went wrong!", {
                description: err?.response.data.message || err.message,
              });
            }
          } finally {
            setSubmitting(false);
          }
        }}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({ errors, touched, isSubmitting, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-2 relative w-full font-custom">
              <label
                htmlFor="email"
                className="text-white text-[17px] leading-[20px] font-semibold"
              >
                Email address <span className="text-red-500">*</span>
              </label>

              <Field
                name="email"
                placeholder="Enter your email address"
                className="h-[42px] mb-[2px] py-4 px-6 rounded-[6.56px] border-blue-500 border-2 w-full text-sm ring-0 focus:ring-0 outline-none"
              />
              {errors.email && touched.email && (
                <p className="text-red-500">{errors.email}</p>
              )}
              {isSubmitting ? (
                <Button
                  type="button"
                  className="bg-gradient-to-b from-[#579FE1] to-[#2290F3] font-medium text-base"
                  disabled
                >
                  Signing up...
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-gradient-to-b from-[#579FE1] to-[#2290F3] font-medium text-base"
                  disabled={isSubmitting}
                >
                  Continue
                </Button>
              )}
            </div>
          </Form>
        )}
      </Formik>

      <div className="py-3 flex items-center justify-center">
        <div className="border-t-[1px] border-solid border-white flex-grow"></div>
        <span className="mx-2 text-[#ffffff] text-base font-normal">Or</span>
        <div className="border-t-[1px] border-solid border-white flex-grow"></div>
      </div>

      <Button
        onClick={handleGoogleSignUp}
        variant="outline"
        className="w-full bg-white font-custom text-base font-normal text-black border-blue-300 border-2"
      >
        <img src={googleLogo.src} alt="Google Logo" className="w-6 h-6 mr-2" />
        Continue With Google
      </Button>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}