import React, { useState, Suspense } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Input from "../input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChangePass } from "@/lib/actions/auth";
import { toast } from "sonner";

const validationSchema = Yup.object({
  oldPassword: Yup.string().required("Old Password is required"),
  newPassword: Yup.string()
    .required("New Password is required")
    .notOneOf([Yup.ref("oldPassword")], "New password must be different from old password"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), undefined], "Passwords must match")
    .required("Confirm Password is required"),
});

function ChangePassword() {
  const { data: session }:any = useSession();
  const [saveLoading, setSaveLoading] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setSaveLoading(true);

        // Check if new password is same as old password
        if (values.oldPassword === values.newPassword) {
          toast.error("New password cannot be the same as your old password!");
          return;
        }

        const payload = {
          userId: session?.user?.id,
          currentPassword: values.oldPassword,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        };

        await ChangePass(payload);

        toast.success("Password changed successfully!");
        router.push("/doctor/dashboard");
        
      } catch (error) {
        if (error instanceof Error) {
          // Check for specific error messages from the backend
          if (error.message.includes("previous password")) {
            toast.error("You cannot reuse your previous password!");
          } else {
            toast.error(error.message || "🚨Oops... Something went wrong!");
          }
        } else {
          toast.error("🚨Oops... Something went wrong!");
        }
      } finally {
        setSaveLoading(false);
      }
    },
  });

  return (
    <div className="px-2">
      <div className="space-y-4 font-custom mt-1">
        <div className="relative">
          <h1 className="text-[30px] font-semibold leading-[36.57px]">
            <span className="text-blue-400">Change Password</span>
          </h1>
        </div>
      </div>

      <form
        className="w-full mt-6 max-w-[400px] flex flex-col space-y-6"
        onSubmit={formik.handleSubmit}
      >
        <InputField
          label="Old Password"
          name="oldPassword"
          placeholder="Enter Old Password"
          formik={formik}
          type="password"
        />
        <InputField
          label="New Password"
          name="newPassword"
          placeholder="Enter New Password"
          formik={formik}
          type="password"
        />
        <InputField
          label="Confirm Password"
          name="confirmPassword"
          placeholder="Confirm Password"
          formik={formik}
          type="password"
        />
        <Button
          disabled={saveLoading}
          className="bg-gradient-to-b from-[#579FE1] to-[#2290F3] w-1/2 "
          type="submit"
        >
          {saveLoading ? "Saving..." : "Save"}
        </Button>
      </form>
    </div>
  );
}

function InputField({ label, name, placeholder, formik, type = "text" }: any) {
  return (
    <div className="w-full">
      <label htmlFor={name} className="text-black font-semibold mb-1">
        {label} <span className="text-red-500">*</span>
      </label>
      <Input
        name={name}
        type={type}
        placeholder={placeholder}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`w-full border-2 p-2 rounded focus:outline-none ${
          formik.touched[name] && formik.errors[name]
            ? "border-red-500"
            : "border-blue-300"
        }`}
      />
      {formik.touched[name] && formik.errors[name] && (
        <p className="text-red-500 text-xs mt-1">{formik.errors[name]}</p>
      )}
    </div>
  );
}

export default function WrappedChangePassword() {
  return (
    <Suspense>
      <ChangePassword />
    </Suspense>
  );
}