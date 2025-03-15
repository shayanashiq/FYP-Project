"use client";

import React, { useState, Suspense } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Input from "./input";
import { Button } from "./ui/button";
import profileImg from "@/assets/images/profile-logo.png";
import editBtn from "../assets/images/edit.png";
import { useRouter, useSearchParams } from "next/navigation";
import { BASE_URL } from "@/common/constant/apis-urls";
import { useSession } from "next-auth/react";
import { fileUpload, saveDoctorProfile } from "@/lib/actions/auth";
import { toast } from "sonner";
import { Loader } from "./shared/loader";
import Image from "next/image";
const Spinner = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 rounded-full">
    <div className="w-8 h-8 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
  </div>
);

const phoneRegExp = /^[2-9]{1}[0-9]{9}$/;

const validationSchema = Yup.object({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  specialization: Yup.string().required("Specialization is required"),
  number: Yup.string()
    .matches(phoneRegExp, "Phone Number is not valid")
    .required("Phone Number is required"),
  spso: Yup.string(),
  // .matches(/^\d{5}$/, "CPSO Number must be a 5-digit number")
});

function ClientProfileForm() {
  const session: any = useSession();
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const router = useRouter();
  const searchParams: any = useSearchParams();
  const email = searchParams.get("email") || "";
  const [specializations] = useState([
    "Allergy and immunology",
    "Anesthesiology",
    "Cardiology",
    "Dermatology",
    "Diagnostic radiology",
    "Emergency medicine",
    "Endocrinologist",
    "Family medicine",
    "Gastroenterology",
    "General surgery",
    "Geriatrics",
    "Hematology",
    "Internal medicine",
    "Medical genetics",
    "Neurology",
    "Nuclear medicine",
    "Obstetrics and gynecology",
    "Oncologist",
    "Ophthalmology",
    "Pathology",
    "Pediatrics",
    "Physical medicine and rehabilitation",
    "Preventive medicine",
    "Psychiatry",
    "Radiation oncology",
    "Surgery",
    "Urology",
    "Other",
  ]);
  const [filteredSpecializations, setFilteredSpecializations] = useState<
    string[]
  >([]);

  const [showDropdown, setShowDropdown] = useState(false);
  const handleSpecializationChange = (event: any) => {
    formik.handleChange(event);
    const inputValue = event.target.value;

    // Filter options based on input value
    if (inputValue) {
      const filtered = specializations.filter((spec) =>
        spec.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredSpecializations(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSelectSpecialization = (spec: any) => {
    formik.setFieldValue("specialization", spec);
    formik.setFieldTouched("specialization", true);
    setShowDropdown(false);
  };
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      specialization: "Other",
      number: "",
      spso: "",
      imageUrl: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // <Loader />;
      try {
        setSaveLoading(true);
        const result: any = await saveDoctorProfile(
          {
            firstName: values.firstName,
            lastName: values.lastName,
            specialization: values.specialization,
            number: values.number,
            spso: values.spso,
            imageUrl: values.imageUrl,
          },
          session?.data?.user?.token
        );

        await session.update({
          ...result?.data?.data,
        });
        setSaveLoading(false);
        console.log("redirecting to dashboard")
        router.push(`/doctor/dashboard`);
      } catch (error: any) {
        setSaveLoading(false);
        toast.dismiss();

        toast.error(error?.message || "🚨Oops... Something went wrong!", {
          description: error?.response.data.message || error.message,
        });
      }
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const MAX_FILE_SIZE_MB = 20;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const validImageTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!validImageTypes.includes(file.type)) {
        toast.error("🚨 Only image files (JPEG, PNG, GIF, WEBP) are allowed.");
        return;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast.dismiss();
        toast.error(`🚨Image size should not exceed ${MAX_FILE_SIZE_MB}MB.`);
        return;
      }

      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const uploadResponse: any = await fileUpload(formData);
        if (uploadResponse?.data?.data) {
          console.log("uploadResponse?.data?.data", uploadResponse?.data?.data);
          const fileInfo = uploadResponse?.data?.data[0];
          console.log("fileInfo?.fileName", fileInfo);

          formik.setFieldValue("imageUrl", fileInfo?.fileName);
        } else {
          toast.error(uploadResponse.message || "🚨Failed to save profile.", {
            description: uploadResponse.message,
          });
        }
      } catch (error: any) {
        console.log("error", error);
        toast.dismiss();
        toast.error(error?.message || "🚨Oops... Something went wrong!", {
          description: error?.response?.data?.message || error?.message,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  console.log("formik.values.imageUrl", formik.values.imageUrl);
  const imageUrl = formik.values.imageUrl
    ? `${BASE_URL}/download?fileName=${formik.values.imageUrl}`
    : profileImg.src;

    console.log(session, "session")
  return (
    <>
      <div className="flex flex-col items-center space-y-4  font-custom">
        <div className="relative flex flex-col items-center -mt-2">
          <h1 className="font-semibold text-[24px] md:text-[36px] leading-[30px] lg:text-[43px]">
            Few More Details
          </h1>
        </div>

        <p className="text-center text-sm md:text-base lg:text-lg text-gray-600">
          Create Your Profile To Get Started
        </p>

        <div className="relative h-[80px] w-[80px]">
          <Image
            src={formik.values.imageUrl ? imageUrl : profileImg.src}
            alt="Profile"
            layout="fill"
            objectFit="cover"
            placeholder="blur"
            blurDataURL={profileImg.src} // Fallback image for blur effect
            className={`rounded-full ${
              formik.values.imageUrl ? "border border-blue-500" : "border-none"
            }`}
            priority={formik.values.imageUrl ? false : true}
          />
          {loading && <Spinner />}
          <label
            htmlFor="fileUpload"
            className="absolute bottom-[10px] right-[0px] transform translate-x-[15%] translate-y-[15%] h-[25px] w-[25px] bg-gradient-to-b from-[#579FE1] to-[#2290F3] rounded-full flex items-center justify-center cursor-pointer border border-white"
          >
            <Image src={editBtn.src} alt="Edit" width={16} height={16} />
          </label>
          <input
            type="file"
            id="fileUpload"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
            required
          />
        </div>
      </div>

      <form
        className="w-full max-w-[400px] flex flex-col items-center space-y-3"
        onSubmit={formik.handleSubmit}
      >
        <div className="flex flex-col lg:flex-row w-full space-y-4 lg:space-y-4 lg:space-x-3">
          <div className="w-full mt-4">
            <div className="flex lg:flex-row">
              <label
                htmlFor="firstName"
                className="text-black font-semibold leading-[17.75px] text-[14.56px] mb-1"
              >
                First Name <span className="text-red-500">*</span>
              </label>
            </div>
            <Input
              name="firstName"
              type="text"
              placeholder="Enter your first name"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                input.value = input.value.replace(/\d/g, ""); // Remove numeric characters
                formik.setFieldValue("firstName", input.value); // Update Formik value
              }}
              className={`w-full border-2 p-2 rounded-[6.56px] font-custom focus:outline-none py-4 px-5 ${
                formik.touched.firstName && formik.errors.firstName
                  ? "border-red-500"
                  : "border-blue-300"
              }`}
            />

            {formik.touched.firstName && formik.errors.firstName && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.firstName}
              </p>
            )}
          </div>
          <div className="w-full">
            <div className="flex lg:flex-row">
              <label
                htmlFor="lastName"
                className="text-black font-semibold leading-[17.75px] text-[14.56px] mb-1"
              >
                Last Name <span className="text-red-500">*</span>
              </label>
            </div>
            <Input
              name="lastName"
              type="text"
              placeholder="Enter your last name"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                input.value = input.value.replace(/\d/g, ""); // Remove numeric characters
                formik.setFieldValue("lastName", input.value); // Update Formik value
              }}
              className={`w-full border-2 p-2 rounded-[6.56px] focus:outline-none py-4 px-5 ${
                formik.touched.lastName && formik.errors.lastName
                  ? "border-red-500"
                  : "border-blue-300"
              }`}
            />

            {formik.touched.lastName && formik.errors.lastName && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.lastName}
              </p>
            )}
          </div>
        </div>
        <div className="w-full">
          <div className="flex lg:flex-row">
            <label
              htmlFor="specialization"
              className="text-black font-semibold leading-[17.75px] text-[14.56px] mb-1"
            >
              Speciality <span className="text-red-500">*</span>
            </label>
          </div>
          <div className="relative w-full">
            <Input
              name="specialization"
              type="text"
              placeholder="Enter your specialization"
              value={formik.values.specialization || "Other"} // Default value
              onChange={handleSpecializationChange}
              onBlur={() => setShowDropdown(false)}
              className={`w-full border-2 p-2 rounded-[6.56px] focus:outline-none py-4 px-5 pr-10 ${
                formik.touched.specialization && formik.errors.specialization
                  ? "border-red-500"
                  : "border-blue-300"
              }`}
            />
            {formik.touched.specialization && formik.errors.specialization && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.specialization}
              </p>
            )}

            {/* Dropdown Arrow */}
            <div
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute z-10 w-full mt-1 max-h-40 bg-white border border-gray-300 rounded shadow-lg overflow-y-auto">
                {(filteredSpecializations.length > 0
                  ? filteredSpecializations
                  : specializations
                ).map((spec, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                    onClick={() => handleSelectSpecialization(spec)}
                  >
                    {spec}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="w-full">
          <div className="flex lg:flex-row">
            <label
              htmlFor="number"
              className="text-black font-semibold leading-[17.75px] text-[14.56px] mb-1"
            >
              Phone Number <span className="text-red-500">*</span>
            </label>
          </div>
          <Input
            name="number"
            type="tel"
            placeholder="Enter your number (e.g, 4165551234)"
            value={formik.values.number}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full border-2 p-2 rounded-[6.56px] focus:outline-none py-4 px-5 ${
              formik.touched.number && formik.errors.number
                ? "border-red-500"
                : "border-blue-300"
            }`}
          />
          {formik.touched.number && formik.errors.number && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.number}.</p>
          )}
        </div>
        <div className="w-full">
          <div className="flex lg:flex-row">
            <label
              htmlFor="spso"
              className="text-black font-semibold leading-[17.75px] text-[14.56px] mb-1"
            >
              CPSO Number
            </label>
          </div>
          <Input
            name="spso"
            type="text"
            placeholder="Enter your CPSO Number"
            value={formik.values.spso}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            onInput={(e) => {
              const input = e.target as HTMLInputElement;
              input.value = input.value.replace(/\D/g, ""); // Remove non-numeric characters
              formik.setFieldValue("spso", input.value); // Update Formik value
            }}
            className={`w-full border-2 p-2 rounded-[6.56px] focus:outline-none py-4 px-5 ${
              formik.touched.spso && formik.errors.spso
                ? "border-red-500"
                : "border-blue-300"
            }`}
          />

          {formik.touched.spso && formik.errors.spso && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.spso}</p>
          )}
        </div>

        <div className="w-full flex justify-between space-x-4">
          <Button
            variant="outline"
            className="w-1/2 border-blue-300"
            type="button"
          >
            <a
              href={`${
                process.env.NEXTAUTH_URL
              }/password?email=${encodeURIComponent(email.toString())}`}
              className="text-black"
            >
              Back
            </a>
          </Button>
          <Button
            disabled={saveLoading}
            className="bg-gradient-to-b from-[#579FE1] to-[#2290F3] w-1/2 flex items-center justify-center"
            type="submit"
          >
            {saveLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </>
  );
}

export default function WrappedClientProfileForm() {
  return (
    <Suspense>
      <ClientProfileForm />
    </Suspense>
  );
}