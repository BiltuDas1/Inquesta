import React, { useState } from "react";

interface FormData {
  phoneCountryCode: string;
  phoneNumber: string;
  whatsappCountryCode: string;
  whatsappNumber: string;
  highestQualification: string;
}

export default function UserDataCollectionForm() {
  const [formData, setFormData] = useState<FormData>({
    phoneCountryCode: "+1",
    phoneNumber: "",
    whatsappCountryCode: "+1",
    whatsappNumber: "",
    highestQualification: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name == "phoneNumber" || name == "whatsappNumber") {
      const numericValue = value.replace(/\D/g, "");

      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    }

    // For other fields like highest qualification
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
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
              {/* Country Code Dropdown */}
              <div className="relative w-[100px] shrink-0">
                <select
                  id="countryCode"
                  name="countryCode"
                  value={formData.phoneCountryCode}
                  onChange={handleChange}
                  className="w-full appearance-none bg-[#262a31] text-[#dfe2eb] border border-[#84948e] rounded-lg pl-3 pr-8 py-3 focus:outline-none focus:ring-2 focus:ring-[#6fffd9] focus:border-transparent transition-all"
                >
                  <option value="+91">+91 (IN)</option>
                </select>
                {/* Custom Dropdown Icon */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-[#b9cac3]">
                  <span className="material-symbols-outlined text-[18px]">
                    keyboard_arrow_down
                  </span>
                </div>
              </div>

              {/* Phone Input */}
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
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-[#dfe2eb]"
            >
              WhatsApp Number
            </label>
            <div className="flex gap-2">
              {/* Country Code Dropdown */}
              <div className="relative w-[100px] shrink-0">
                <select
                  id="countryCode"
                  name="countryCode"
                  value={formData.whatsappCountryCode}
                  onChange={handleChange}
                  className="w-full appearance-none bg-[#262a31] text-[#dfe2eb] border border-[#84948e] rounded-lg pl-3 pr-8 py-3 focus:outline-none focus:ring-2 focus:ring-[#6fffd9] focus:border-transparent transition-all"
                >
                  <option value="+91">+91 (IN)</option>
                </select>
                {/* Custom Dropdown Icon */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-[#b9cac3]">
                  <span className="material-symbols-outlined text-[18px]">
                    keyboard_arrow_down
                  </span>
                </div>
              </div>

              {/* Phone Input */}
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
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
            className="w-full bg-[#6fffd9] text-[#00382c] font-['Plus_Jakarta_Sans',sans-serif] font-semibold py-3 px-4 rounded-lg hover:bg-[#00e5bc] focus:outline-none focus:ring-4 focus:ring-[#6fffd9]/50 transition-colors mt-4"
          >
            Save Details
          </button>
        </form>
      </div>
    </div>
  );
}
