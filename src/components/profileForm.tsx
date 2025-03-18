"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CustomerProfile } from "@/types/customerProfile";
import { User } from "@/types/user";

const CustomerProfileForm: React.FC = () => {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<CustomerProfile>({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
  });

  const user = session?.user as User;
  
  useEffect(() => {
    if (!user) return;
    if (user.customerProfile) {
      setProfile(user.customerProfile);
    } else {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/customer-profile");
      const data = await response.json();
      if (data.data) setProfile(data.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = user?.isProfileComplete ? "PUT" : "POST";
      const response = await fetch("/api/customer-profile", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save profile");
      }

      toast.success(data.message);
      await update({ user: { ...session?.user, customerProfile: profile, isProfileComplete: true } });

      if (!user?.isProfileComplete) {
        router.push("/");
      }
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error(error.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Customer Profile</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "First Name", name: "firstName", type: "text", required: true },
            { label: "Last Name", name: "lastName", type: "text", required: true },
            { label: "Phone Number", name: "phone", type: "tel" },
            { label: "Address", name: "address", type: "text" },
            { label: "City", name: "city", type: "text" },
            { label: "Country", name: "country", type: "text" },
            { label: "Zip Code", name: "zipCode", type: "text" },
          ].map(({ label, name, type, required }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700">
                {label} {required && "*"}
              </label>
              <input
                type={type}
                name={name}
                value={profile[name as keyof CustomerProfile] || ""}
                onChange={handleChange}
                required={required}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full py-2 px-4 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
        >
          {loading ? "Saving..." : user?.isProfileComplete ? "Update Profile" : "Create Profile"}
        </button>
      </form>
    </div>
  );
};

export default CustomerProfileForm;
