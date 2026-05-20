import React, { useState } from "react";

export default function ContactPage() {
  const [inquiryType, setInquiryType] = useState("General Inquiry");

  const inquiryOptions = [
    "General Inquiry",
    "Program Enrollment",
    "Workshop / Demo",
    "Collaboration",
    "Other",
  ];

  // Raw SVG paths for brands since Material Icons doesn't include them
  const socialIcons = [
    {
      name: "Facebook",
      path: "M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-1.1 0-2 .9-2 2v1h3l-1 3h-2v6.8c4.56-.93 8-4.96 8-9.8z",
    },
    {
      name: "Instagram",
      path: "M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.4 5.6 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.6 18.4 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 .4-.02V6.5m-5.25 2.5c2.48 0 4.5 2.03 4.5 4.5s-2.02 4.5-4.5 4.5-4.5-2.03-4.5-4.5 2.02-4.5 4.5-4.5m0 1.5a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z",
    },
    {
      name: "YouTube",
      path: "M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM10 15V9l5.2 3-5.2 3z",
    },
    {
      name: "LinkedIn",
      path: "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z",
    },
    {
      name: "WhatsApp",
      path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z",
    },
  ];

  return (
    <div className="min-h-screen bg-[#10141a] font-body text-[#dfe2eb] p-4 md:p-8 lg:p-12 mt-15">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* ==========================================
            LEFT COLUMN (INFO CARDS)
            ========================================== */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          {/* 1. Quick Contact Card */}
          <div className="bg-[#1c2026] border border-[#3b4a44] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#181c22] w-10 h-10 flex items-center justify-center rounded-full text-[#6fffd9]">
                <span className="material-symbols-outlined text-[20px]">
                  call
                </span>
              </div>
              <div>
                <h3 className="font-headline font-semibold text-lg">
                  Quick Contact
                </h3>
                <p className="text-[#b9cac3] text-sm">Reach us directly</p>
              </div>
            </div>
            <div className="space-y-4 text-sm">
              <div className="flex flex-col">
                <span className="text-[#84948e] text-xs font-bold tracking-wider uppercase mb-1">
                  Phone / WhatsApp
                </span>
                <span className="text-[#6fffd9] font-medium">
                  +91 99999 99999
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[#84948e] text-xs font-bold tracking-wider uppercase mb-1">
                  Email
                </span>
                <a
                  href="mailto:hello@inquesta.org"
                  className="text-[#6fffd9] font-medium hover:underline"
                >
                  hello@inquesta.org
                </a>
              </div>
              <div className="flex flex-col">
                <span className="text-[#84948e] text-xs font-bold tracking-wider uppercase mb-1">
                  Website
                </span>
                <a
                  href="https://inquesta.org"
                  className="text-[#6fffd9] font-medium hover:underline"
                >
                  inquesta.org
                </a>
              </div>
            </div>
          </div>

          {/* 2. Location Card */}
          <div className="bg-gradient-to-br from-[#1c2026] to-[#181c22] border border-[#3b4a44] rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#6fffd9] opacity-5 rounded-bl-full pointer-events-none"></div>

            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#31353c] w-8 h-8 flex items-center justify-center rounded-full text-[#ffb4ab]">
                <span className="material-symbols-outlined text-[18px]">
                  location_on
                </span>
              </div>
              <span className="text-[#6fffd9] font-headline font-semibold text-sm">
                Our Location
              </span>
            </div>
            <h2 className="font-headline font-bold text-2xl text-white mb-2 leading-tight">
              Behala, South
              <br />
              Kolkata
            </h2>
            <p className="text-[#b9cac3] text-sm mb-6">
              West Bengal, India — 700 034
            </p>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 bg-[#262a31] w-fit px-3 py-1.5 rounded-full text-xs text-[#dfe2eb] border border-[#3b4a44]">
                <span className="material-symbols-outlined text-[16px] text-[#b9cac3]">
                  directions_bus
                </span>{" "}
                Well Connected by Bus
              </div>
              <div className="flex items-center gap-2 bg-[#262a31] w-fit px-3 py-1.5 rounded-full text-xs text-[#dfe2eb] border border-[#3b4a44]">
                <span className="material-symbols-outlined text-[16px] text-[#b9cac3]">
                  directions_subway
                </span>{" "}
                Near Metro Corridor
              </div>
              <div className="flex items-center gap-2 bg-[#262a31] w-fit px-3 py-1.5 rounded-full text-xs text-[#dfe2eb] border border-[#3b4a44]">
                <span className="material-symbols-outlined text-[16px] text-[#b9cac3]">
                  map
                </span>{" "}
                Heart of Behala
              </div>
            </div>

            <button className="w-full bg-[#6fffd9] hover:bg-[#00e5bc] text-[#00382c] font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[20px]">
                location_on
              </span>{" "}
              Get Directions
            </button>
          </div>

          {/* 3. Programme Hours */}
          <div className="bg-[#1c2026] border border-[#3b4a44] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#181c22] w-10 h-10 flex items-center justify-center rounded-full text-[#6fffd9]">
                <span className="material-symbols-outlined text-[20px]">
                  schedule
                </span>
              </div>
              <div>
                <h3 className="font-headline font-semibold text-lg">
                  Programme Hours
                </h3>
                <p className="text-[#b9cac3] text-xs">
                  Walk-ins welcome during hours
                </p>
              </div>
            </div>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-start border-b border-[#3b4a44] pb-3">
                <span className="font-medium text-[#dfe2eb]">
                  Monday –<br />
                  Friday
                </span>
                <div className="text-right">
                  <span className="text-[#b9cac3]">3:00 PM – 8:00 PM</span>
                  <br />
                  <span className="text-[10px] bg-[#262a31] text-[#6fffd9] px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                    After-School
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-start border-b border-[#3b4a44] pb-3">
                <span className="font-medium text-[#dfe2eb]">Saturday</span>
                <div className="text-right">
                  <span className="text-[#b9cac3]">10:00 AM – 6:00 PM</span>
                  <br />
                  <span className="text-[10px] bg-[#262a31] text-[#6fffd9] px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                    Weekend
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-start border-b border-[#3b4a44] pb-3">
                <span className="font-medium text-[#dfe2eb]">Sunday</span>
                <div className="text-right">
                  <span className="text-[#b9cac3]">10:00 AM – 2:00 PM</span>
                  <br />
                  <span className="text-[10px] bg-[#262a31] text-[#6fffd9] px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                    Weekend
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center text-[#ffb4ab]">
                <span className="font-medium">Public Holidays</span>
                <span className="text-xs uppercase font-bold tracking-wider">
                  Closed
                </span>
              </div>
            </div>
          </div>

          {/* 4. Social Links */}
          <div className="bg-[#1c2026] border border-[#3b4a44] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#181c22] w-10 h-10 flex items-center justify-center rounded-full text-[#6fffd9]">
                <span className="material-symbols-outlined text-[20px]">
                  public
                </span>
              </div>
              <div>
                <h3 className="font-headline font-semibold text-lg">
                  Find Us Online
                </h3>
                <p className="text-[#b9cac3] text-xs">
                  Follow for updates & alerts
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {socialIcons.map((social) => (
                <a
                  key={social.name}
                  href="#"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[#3b4a44] bg-[#181c22] hover:bg-[#262a31] hover:border-[#84948e] transition-all text-[#dfe2eb] text-sm font-medium group"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-[#84948e] group-hover:text-[#6fffd9] transition-colors"
                  >
                    <path d={social.path} />
                  </svg>
                  {social.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ==========================================
            RIGHT COLUMN (CONTACT FORM)
            ========================================== */}
        <div className="w-full lg:w-2/3">
          <div className="bg-[#1c2026] border border-[#3b4a44] rounded-2xl p-6 md:p-10 shadow-sm sticky top-8">
            <div className="mb-8">
              <span className="text-[#6fffd9] text-xs font-bold tracking-widest uppercase mb-2 block">
                Send a Message
              </span>
              <h1 className="font-headline text-4xl md:text-5xl font-bold text-white mb-4">
                What Can We
                <br />
                Help You With?
              </h1>
              <p className="text-[#b9cac3]">
                Fill in the form and we'll get back to you within one business
                day.
              </p>
            </div>

            <form className="space-y-6">
              {/* Inquiry Pills */}
              <div className="flex flex-wrap gap-2 mb-8">
                {inquiryOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setInquiryType(option)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                      inquiryType === option
                        ? "bg-[#00382c] border-[#6fffd9] text-[#6fffd9]"
                        : "bg-[#181c22] border-[#3b4a44] text-[#b9cac3] hover:border-[#84948e]"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#dfe2eb]">
                    First Name <span className="text-[#ffb4ab]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Priya"
                    className="w-full bg-[#10141a] border border-[#3b4a44] rounded-lg px-4 py-3 text-[#dfe2eb] placeholder-[#84948e] focus:outline-none focus:border-[#6fffd9] focus:ring-1 focus:ring-[#6fffd9] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#dfe2eb]">
                    Last Name <span className="text-[#ffb4ab]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sharma"
                    className="w-full bg-[#10141a] border border-[#3b4a44] rounded-lg px-4 py-3 text-[#dfe2eb] placeholder-[#84948e] focus:outline-none focus:border-[#6fffd9] focus:ring-1 focus:ring-[#6fffd9] transition-all"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-[#dfe2eb]">
                    Email Address <span className="text-[#ffb4ab]">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full bg-[#10141a] border border-[#3b4a44] rounded-lg px-4 py-3 text-[#dfe2eb] placeholder-[#84948e] focus:outline-none focus:border-[#6fffd9] focus:ring-1 focus:ring-[#6fffd9] transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#dfe2eb]">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98000 00000"
                    className="w-full bg-[#10141a] border border-[#3b4a44] rounded-lg px-4 py-3 text-[#dfe2eb] placeholder-[#84948e] focus:outline-none focus:border-[#6fffd9] focus:ring-1 focus:ring-[#6fffd9] transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#dfe2eb]">
                    I am a <span className="text-[#ffb4ab]">*</span>
                  </label>
                  <select className="w-full bg-[#10141a] border border-[#3b4a44] rounded-lg px-4 py-3 text-[#dfe2eb] focus:outline-none focus:border-[#6fffd9] focus:ring-1 focus:ring-[#6fffd9] transition-all appearance-none cursor-pointer">
                    <option value="student">Student</option>
                    <option value="parent">Parent / Guardian</option>
                    <option value="educator">Educator</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Textarea */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#dfe2eb]">
                  Your Message <span className="text-[#ffb4ab]">*</span>
                </label>
                <textarea
                  rows={5}
                  placeholder="Tell us what you'd like to know, or what you're looking for in a program..."
                  className="w-full bg-[#10141a] border border-[#3b4a44] rounded-lg px-4 py-3 text-[#dfe2eb] placeholder-[#84948e] focus:outline-none focus:border-[#6fffd9] focus:ring-1 focus:ring-[#6fffd9] transition-all resize-y"
                ></textarea>
              </div>

              {/* Checkbox */}
              <div className="flex items-start gap-3 mt-4">
                <input
                  type="checkbox"
                  id="privacy"
                  className="mt-1 w-4 h-4 rounded border-[#3b4a44] bg-[#10141a] checked:bg-[#6fffd9] checked:border-[#6fffd9] cursor-pointer"
                />
                <label
                  htmlFor="privacy"
                  className="text-sm text-[#b9cac3] cursor-pointer leading-tight"
                >
                  I agree to Inquesta's{" "}
                  <a href="#" className="text-[#6fffd9] hover:underline">
                    Privacy Policy
                  </a>{" "}
                  and consent to being contacted regarding my inquiry.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                className="w-full md:w-auto mt-6 bg-[#6fffd9] hover:bg-[#00e5bc] text-[#00382c] font-bold text-base px-8 py-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#00e5bc]/10"
              >
                <span className="material-symbols-outlined text-[20px]">
                  send
                </span>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
