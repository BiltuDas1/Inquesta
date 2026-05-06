import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

interface FormData {
  phoneCountryCode: string;
  phoneNumber: string;
  whatsappCountryCode: string;
  whatsappNumber: string;
  highestQualification: string;
}

// Mutation
const UPDATE_USER_INFO = gql`
  mutation updateUserInfo(
    $phone_number: String!
    $phone_number_country_code: Int!
    $qualification: String!
    $whatsapp_number: String!
    $whatsapp_number_country_code: Int!
  ) {
    updateUserInfo(
      phone_number: $phone_number
      phone_number_country_code: $phone_number_country_code
      qualification: $qualification
      whatsapp_number: $whatsapp_number
      whatsapp_number_country_code: $whatsapp_number_country_code
    ) {
      message
      success
    }
  }
`;

// Response
interface UpdateUserInfoResponse {
  updateUserInfo: {
    message: string;
    success: boolean;
  };
}

export default function UserDataCollectionForm() {
  const navigate = useNavigate();

  // Initialize Apollo Mutation Hook
  const [updateUserInfo, { loading }] =
    useMutation<UpdateUserInfoResponse>(UPDATE_USER_INFO);

  const [formData, setFormData] = useState<FormData>({
    phoneCountryCode: "+91",
    phoneNumber: "",
    whatsappCountryCode: "+91",
    whatsappNumber: "",
    highestQualification: "",
  });

  // Reusable save function that takes the current state of the form
  const executeSave = async (dataToSave: FormData, isAutoSave = false) => {
    try {
      const phoneCodeInt = parseInt(
        dataToSave.phoneCountryCode.replace("+", ""),
        10,
      );
      const whatsappCodeInt = parseInt(
        dataToSave.whatsappCountryCode.replace("+", ""),
        10,
      );

      const { data } = await updateUserInfo({
        variables: {
          phone_number: dataToSave.phoneNumber,
          phone_number_country_code: phoneCodeInt,
          whatsapp_number: dataToSave.whatsappNumber,
          whatsapp_number_country_code: whatsappCodeInt,
          qualification: dataToSave.highestQualification,
        },
      });

      if (data?.updateUserInfo?.success) {
        // If it's an auto-save, we might just want to show a small toast without redirecting
        if (isAutoSave) {
          // toast.success("Number auto-saved!");
        } else {
          // toast.success(
          //   data.updateUserInfo.message || "Details saved successfully!",
          // );
          navigate("/courses");
        }
      } else {
        // toast.error(data?.updateUserInfo?.message || "Failed to save details.");
      }
    } catch (error: any) {
      console.error("Mutation error:", error);
      toast.error(error.message || "An unexpected error occurred.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "phoneNumber" || name === "whatsappNumber") {
      const numericValue = value.replace(/\D/g, "");

      // Create the updated state object immediately so we can pass it to the auto-save
      const updatedFormData = {
        ...formData,
        [name]: numericValue,
      };

      setFormData(updatedFormData);

      if (numericValue.length === 10) {
        executeSave(updatedFormData, true);
      }
      return;
    }

    // For other fields like highest qualification
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Pass the current state and mark as false for isAutoSave to trigger the redirect
    await executeSave(formData, false);
  };

  return (
    <div className="min-h-screen bg-[#10141a] flex items-center justify-center p-4 font-['Inter',sans-serif]">
      <div className="w-full max-w-md bg-[#1c2026] rounded-2xl shadow-xl border border-[#3b4a44] overflow-hidden">
        {/* Header Section */}
        <div className="p-8 border-b border-[#3b4a44]">
          <h2 className="text-3xl font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#6fffd9] mb-2">
            Your Details
          </h2>

          <p className="text-sm text-[#b9cac3]">
            Please provide your contact information and qualifications.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Phone Number Field with Country Code */}
          <div className="space-y-2">
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-[#dfe2eb]"
            >
              Phone Number
            </label>
            <div className="flex gap-2">
              <div className="relative w-[100px] shrink-0">
                <select
                  id="phoneCountryCode"
                  name="phoneCountryCode"
                  value={formData.phoneCountryCode}
                  onChange={handleChange}
                  className="w-full appearance-none bg-[#262a31] text-[#dfe2eb] border border-[#84948e] rounded-lg pl-3 pr-8 py-3 focus:outline-none focus:ring-2 focus:ring-[#6fffd9] focus:border-transparent transition-all"
                >
                  <option value="+91">+91 (IN)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-[#b9cac3]">
                  <span className="material-symbols-outlined text-[18px]">
                    keyboard_arrow_down
                  </span>
                </div>
              </div>

              <input
                type="tel"
                inputMode="numeric"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                maxLength={10}
                placeholder="(555) 000-0000"
                required
                className="flex-1 w-full bg-[#262a31] text-[#dfe2eb] border border-[#84948e] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6fffd9] focus:border-transparent transition-all placeholder-[#b9cac3]/50"
              />
            </div>
          </div>

          {/* WhatsApp Number Field */}
          <div className="space-y-2">
            <label
              htmlFor="whatsappNumber"
              className="block text-sm font-medium text-[#dfe2eb]"
            >
              WhatsApp Number
            </label>
            <div className="flex gap-2">
              <div className="relative w-[100px] shrink-0">
                <select
                  id="whatsappCountryCode"
                  name="whatsappCountryCode"
                  value={formData.whatsappCountryCode}
                  onChange={handleChange}
                  className="w-full appearance-none bg-[#262a31] text-[#dfe2eb] border border-[#84948e] rounded-lg pl-3 pr-8 py-3 focus:outline-none focus:ring-2 focus:ring-[#6fffd9] focus:border-transparent transition-all"
                >
                  <option value="+91">+91 (IN)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-[#b9cac3]">
                  <span className="material-symbols-outlined text-[18px]">
                    keyboard_arrow_down
                  </span>
                </div>
              </div>

              <input
                type="tel"
                id="whatsappNumber"
                inputMode="numeric"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
                maxLength={10}
                placeholder="(555) 000-0000"
                required
                className="flex-1 w-full bg-[#262a31] text-[#dfe2eb] border border-[#84948e] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6fffd9] focus:border-transparent transition-all placeholder-[#b9cac3]/50"
              />
            </div>
          </div>

          {/* Highest Qualification Field */}
          <div className="space-y-2">
            <label
              htmlFor="highestQualification"
              className="block text-sm font-medium text-[#dfe2eb]"
            >
              Highest Qualification
            </label>
            <input
              type="text"
              id="highestQualification"
              name="highestQualification"
              value={formData.highestQualification}
              onChange={handleChange}
              placeholder="e.g., Higher Secondary Education"
              required
              className="w-full bg-[#262a31] text-[#dfe2eb] border border-[#84948e] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6fffd9] focus:border-transparent transition-all placeholder-[#b9cac3]/50"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-xl text-sm transition-colors duration-200 tracking-wide mb-5 
                ${loading ? "bg-[#4a7070] cursor-not-allowed opacity-80" : "bg-[#00d4aa] hover:bg-[#00bfa0] active:bg-[#00a88c] cursor-pointer"}`}
          >
            {loading && (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {loading ? "Saving Details..." : "Save Details"}
          </button>
        </form>
      </div>
    </div>
  );
}
