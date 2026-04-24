import React, { useState } from 'react';

// Optional: Define interfaces for your form state
interface FormData {
  phoneNumber: string;
  whatsappNumber: string;
  highestQualification: string;
}

export default function UserDataCollectionForm() {
  const [formData, setFormData] = useState<FormData>({
    phoneNumber: '',
    whatsappNumber: '',
    highestQualification: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-[#10141a] flex items-center justify-center p-4 font-['Inter',sans-serif]">
      
      {/* Form Container ($surface-container: #1c2026, $outline-variant: #3b4a44) */}
      <div className="w-full max-w-md bg-[#1c2026] rounded-2xl shadow-xl border border-[#3b4a44] overflow-hidden">
        
        {/* Header Section */}
        <div className="p-8 border-b border-[#3b4a44]">
          {/* Headline font and $primary: #6fffd9 */}
          <h2 className="text-3xl font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#6fffd9] mb-2">
            Your Details
          </h2>
          {/* $on-surface-variant: #b9cac3 */}
          <p className="text-sm text-[#b9cac3]">
            Please provide your contact information and qualifications.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Phone Number Field */}
          <div className="space-y-2">
            {/* $on-surface: #dfe2eb */}
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-[#dfe2eb]">
              Phone Number
            </label>
            {/* $surface-container-high: #262a31, $outline: #84948e, focus $primary: #6fffd9 */}
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              required
              className="w-full bg-[#262a31] text-[#dfe2eb] border border-[#84948e] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6fffd9] focus:border-transparent transition-all placeholder-[#b9cac3]/50"
            />
          </div>

          {/* WhatsApp Number Field */}
          <div className="space-y-2">
            <label htmlFor="whatsappNumber" className="block text-sm font-medium text-[#dfe2eb]">
              WhatsApp Number
            </label>
            <input
              type="tel"
              id="whatsappNumber"
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              required
              className="w-full bg-[#262a31] text-[#dfe2eb] border border-[#84948e] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6fffd9] focus:border-transparent transition-all placeholder-[#b9cac3]/50"
            />
          </div>

          {/* Highest Qualification Field */}
          <div className="space-y-2">
            <label htmlFor="highestQualification" className="block text-sm font-medium text-[#dfe2eb]">
              Highest Qualification
            </label>
            <div className="relative">
              <select
                id="highestQualification"
                name="highestQualification"
                value={formData.highestQualification}
                onChange={handleChange}
                required
                className="w-full appearance-none bg-[#262a31] text-[#dfe2eb] border border-[#84948e] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6fffd9] focus:border-transparent transition-all"
              >
                <option value="" disabled className="text-[#b9cac3]">
                  Select your qualification
                </option>
                <option value="high_school">High School / Diploma</option>
                <option value="bachelors">Bachelor's Degree</option>
                <option value="masters">Master's Degree</option>
                <option value="doctorate">Doctorate (PhD)</option>
              </select>
              {/* Custom Dropdown Icon */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#b9cac3]">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          {/* bg $primary: #6fffd9, text $on-primary: #00382c, hover $primary-container: #00e5bc */}
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