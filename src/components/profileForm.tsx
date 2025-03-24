"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { CustomerProfile } from "@/types/customerProfile";
import { User } from "@/types/user";

const CustomerProfileForm: React.FC = () => {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<CustomerProfile>({
    firstName: "",
    lastName: "",
    imageUrl: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = session?.user as User;
  
  useEffect(() => {
    if (!user) return;
    if (user.customerProfile) {
      setProfile(user.customerProfile);
      if (user.customerProfile.imageUrl) {
        setImagePreview(user.customerProfile.imageUrl);
      }
    } else {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/customer-profile");
      const data = await response.json();
      if (data.data) {
        setProfile(data.data);
        if (data.data.imageUrl) {
          setImagePreview(data.data.imageUrl);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (file: File): Promise<string> => {
    // Create form data
    const formData = new FormData();
    formData.append('image', file);
    
    // Upload to your image storage API
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload image');
    }
    
    const data = await response.json();
    return data.imageUrl; // Return the URL of the uploaded image
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let updatedProfile = { ...profile };
      
      // If there's a new image file, upload it first
      if (imageFile) {
        const imageUrl = await uploadImage(imageFile);
        updatedProfile.imageUrl = imageUrl;
      }
      
      const method = user?.isProfileComplete ? "PUT" : "POST";
      const response = await fetch("/api/customer-profile", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProfile),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save profile");
      }

      toast.success(data.message);
      await update({ user: { ...session?.user, customerProfile: updatedProfile, isProfileComplete: true } });

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
          {/* Profile Image Upload Section */}
          <div className="col-span-1 md:col-span-2 flex flex-col items-center mb-4">
            <div className="w-32 h-32 relative rounded-full overflow-hidden mb-4 bg-gray-100 border border-gray-300">
              {imagePreview ? (
                <Image 
                  src={imagePreview} 
                  alt="Profile Preview" 
                  fill 
                  style={{ objectFit: 'cover' }} 
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No Image
                </div>
              )}
            </div>
            
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
            
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Upload Image
            </button>
          </div>

          {/* Other Form Fields */}
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
          className="mt-6 w-full py-2 px-4 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
        >
          {loading ? "Saving..." : user?.isProfileComplete ? "Update Profile" : "Create Profile"}
        </button>
      </form>
    </div>
  );
};

export default CustomerProfileForm;