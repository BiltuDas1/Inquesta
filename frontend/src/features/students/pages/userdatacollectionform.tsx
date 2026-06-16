// import { gql } from "@apollo/client";
// import { useMutation } from "@apollo/client/react";
// import React, { useState } from "react";
// import toast from "react-hot-toast";
// import { useNavigate, useLocation } from "react-router";
// import { EnrollmentSuccess } from "../../courses/components/enrollmentsuccessmodal";

// interface FormData {
//   phoneCountryCode: string;
//   phoneNumber: string;
//   whatsappCountryCode: string;
//   whatsappNumber: string;
//   highestQualification: string;
// }

// // Mutations & Queries
// const UPDATE_USER_INFO = gql`
//   mutation updateUserInfo(
//     $phone_number: String!
//     $phone_number_country_code: Int!
//     $qualification: String!
//     $whatsapp_number: String!
//     $whatsapp_number_country_code: Int!
//   ) {
//     updateUserInfo(
//       phone_number: $phone_number
//       phone_number_country_code: $phone_number_country_code
//       qualification: $qualification
//       whatsapp_number: $whatsapp_number
//       whatsapp_number_country_code: $whatsapp_number_country_code
//     ) {
//       message
//       success
//     }
//   }
// `;

// const ENROLL_COURSE_MUTATION = gql`
//   mutation enrollCourse($courseID: String!, $transactionID: String!) {
//     enrollCourse(courseID: $courseID, transactionID: $transactionID) {
//       message
//       success
//     }
//   }
// `;

// const GET_ENROLLED_COURSES = gql`
//   query enrolledCourses {
//     enrolledCourses {
//       data {
//         id
//       }
//     }
//   }
// `;

// interface UpdateUserInfoResponse {
//   updateUserInfo: {
//     message: string;
//     success: boolean;
//   };
// }

// interface EnrollCourseResponse {
//   enrollCourse: {
//     success: boolean;
//     message: string;
//   };
// }

// export default function UserDataCollectionForm() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Parse state passed during redirection
//   const state = location.state as { redirectTo?: string; openPayment?: boolean; course?: any } | null;
//   const course = state?.course;

//   // Mutation Hooks
//   const [updateUserInfo, { loading }] = useMutation<UpdateUserInfoResponse>(UPDATE_USER_INFO);
//   const [enrollCourse, { loading: isSubmitting }] = useMutation<EnrollCourseResponse>(ENROLL_COURSE_MUTATION);

//   // States
//   const [showPayment, setShowPayment] = useState<boolean>(false);
//   const [transactionId, setTransactionId] = useState<string>("");
//   const [showSuccess, setShowSuccess] = useState<boolean>(false);

//   const [formData, setFormData] = useState<FormData>({
//     phoneCountryCode: "+91",
//     phoneNumber: "",
//     whatsappCountryCode: "+91",
//     whatsappNumber: "",
//     highestQualification: "",
//   });

//   const [selectedQualOption, setSelectedQualOption] = useState<string>("");

//   const executeSave = async (dataToSave: FormData, isAutoSave = false) => {
//     try {
//       const phoneCodeInt = parseInt(
//         dataToSave.phoneCountryCode.replace("+", ""),
//         10,
//       );
//       const whatsappCodeInt = parseInt(
//         dataToSave.whatsappCountryCode.replace("+", ""),
//         10,
//       );

//       const { data } = await updateUserInfo({
//         variables: {
//           phone_number: dataToSave.phoneNumber,
//           phone_number_country_code: phoneCodeInt,
//           whatsapp_number: dataToSave.whatsappNumber,
//           whatsapp_number_country_code: whatsappCodeInt,
//           qualification: dataToSave.highestQualification,
//         },
//       });

//       if (data?.updateUserInfo?.success) {
//         if (!isAutoSave) {
//           if (course) {
//             setShowPayment(true);
//           } else if (state?.redirectTo) {
//             navigate(state.redirectTo);
//           } else {
//             navigate("/courses");
//           }
//         }
//       }
//     } catch (error: any) {
//       console.error("Mutation error:", error);
//       if (!isAutoSave)
//         toast.error(error.message || "An unexpected error occurred.");
//     }
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
//   ) => {
//     const { name, value } = e.target;

//     if (name === "phoneNumber" || name === "whatsappNumber") {
//       const numericValue = value.replace(/\D/g, "");
//       const updatedFormData = {
//         ...formData,
//         [name]: numericValue,
//       };
//       setFormData(updatedFormData);

//       if (numericValue.length === 10) {
//         executeSave(updatedFormData, true);
//       }
//       return;
//     }

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = e.target.value;
//     setSelectedQualOption(value);

//     if (value !== "Other") {
//       setFormData((prev) => ({ ...prev, highestQualification: value }));
//     } else {
//       setFormData((prev) => ({ ...prev, highestQualification: "" }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!formData.phoneNumber.trim() && !formData.whatsappNumber.trim()) {
//       toast.error("Please provide either a Phone Number or a WhatsApp Number.");
//       return;
//     }

//     if (!formData.highestQualification.trim()) {
//       toast.error("Please specify your highest qualification.");
//       return;
//     }

//     await executeSave(formData, false);
//   };

//   const handleSubmitPayment = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!transactionId.trim()) {
//       toast.error("Please enter a valid Transaction / UTR ID.");
//       return;
//     }

//     try {
//       const response = await enrollCourse({
//         variables: {
//           courseID: String(course.id),
//           transactionID: transactionId.trim(),
//         },
//         refetchQueries: [{ query: GET_ENROLLED_COURSES }],
//       });

//       if (response.data) {
//         const { success, message } = response.data.enrollCourse;
//         if (success) {
//           setShowSuccess(true);
//           setTransactionId("");
//         } else {
//           toast.error(message || "Failed to submit payment details.");
//         }
//       }
//     } catch (error: any) {
//       console.error("Enrollment error:", error);
//       toast.error(error.message || "An unexpected error occurred. Please try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#10141a] flex items-center justify-center p-4 font-['Inter',sans-serif]">
//       <div className="w-full max-w-md bg-[#1c2026] rounded-2xl shadow-xl border border-[#3b4a44] overflow-hidden">

//         {/* Render Success Screen */}
//         {showSuccess ? (
//           <div className="p-8">
//             <EnrollmentSuccess
//               courseTitle={course?.title || ""}
//               onClose={() => {
//                 setShowSuccess(false);
//                 navigate("/courses");
//               }}
//             />
//           </div>
//         ) : showPayment ? (
//           /* Render Complete Payment Screen */
//           <div>
//             <div className="p-8 border-b border-[#3b4a44]">
//               <h2 className="text-3xl font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#6fffd9] mb-2 font-headline">
//                 Complete Payment
//               </h2>
//               <p className="text-[#b9cac3] text-sm">
//                 Scan the QR code to pay{" "}
//                 <span className="text-[#6fffd9] font-bold">
//                   ₹{course?.price}
//                 </span>
//               </p>
//             </div>

//             <form onSubmit={handleSubmitPayment} className="p-8 space-y-6">
//               <div className="flex items-center justify-center mx-auto mb-6 w-82 h-82 relative overflow-hidden">
//                 <img
//                   src="https://duqixbhmkyazlglmfopk.supabase.co/storage/v1/object/public/Inquesta/uploads/inquesta_QR.jpg"
//                   alt="Payment QR Code"
//                   className="w-full h-full object-contain select-none"
//                   style={{ imageRendering: "pixelated" }}
//                   draggable={false}
//                   crossOrigin="anonymous"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-xs font-bold text-[#84948e] uppercase tracking-wider">
//                   Transaction ID
//                 </label>
//                 <input
//                   type="text"
//                   disabled={isSubmitting}
//                   value={transactionId}
//                   onChange={(e) => setTransactionId(e.target.value)}
//                   placeholder="e.g. 312345678901"
//                   className="w-full bg-[#10141a] border border-[#3b4a44] rounded-xl px-4 py-3 text-[#dfe2eb] text-sm focus:outline-none focus:border-[#6fffd9] transition-colors placeholder:text-[#3b4a44]"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full flex justify-center items-center gap-2 bg-[#6fffd9] hover:bg-[#5cebc5] text-[#00382c] font-black py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(111,255,217,0.2)] text-base font-headline active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait"
//               >
//                 {isSubmitting ? "Submitting..." : "Submit for Verification"}
//               </button>
//             </form>
//           </div>
//         ) : (
//           /* Render Onboarding Details Form */
//           <div>
//             <div className="p-8 border-b border-[#3b4a44]">
//               <h2 className="text-3xl font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#6fffd9] mb-2">
//                 Your Details
//               </h2>
//               <p className="text-sm text-[#b9cac3]">
//                 Please provide your contact information and qualifications.
//               </p>
//             </div>

//             <form onSubmit={handleSubmit} className="p-8 space-y-6">
//               {/* Phone Number Field */}
//               <div className="space-y-2">
//                 <label
//                   htmlFor="phoneNumber"
//                   className="block text-sm font-medium text-[#dfe2eb]"
//                 >
//                   Phone Number{" "}
//                   <span className="text-[#84948e] text-xs font-normal">
//                     (Optional if WhatsApp provided)
//                   </span>
//                 </label>
//                 <div className="flex gap-2">
//                   <div className="relative w-[100px] shrink-0">
//                     <select
//                       id="phoneCountryCode"
//                       name="phoneCountryCode"
//                       value={formData.phoneCountryCode}
//                       onChange={handleChange}
//                       className="w-full appearance-none bg-[#262a31] text-[#dfe2eb] border border-[#84948e] rounded-lg pl-3 pr-8 py-3 focus:outline-none focus:ring-2 focus:ring-[#6fffd9] focus:border-transparent transition-all"
//                     >
//                       <option value="+91">+91 (IN)</option>
//                     </select>
//                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-[#b9cac3]">
//                       <span className="material-symbols-outlined text-[18px]">
//                         keyboard_arrow_down
//                       </span>
//                     </div>
//                   </div>

//                   <input
//                     type="tel"
//                     inputMode="numeric"
//                     id="phoneNumber"
//                     name="phoneNumber"
//                     value={formData.phoneNumber}
//                     onChange={handleChange}
//                     maxLength={10}
//                     placeholder="(555) 000-0000"
//                     className="flex-1 w-full bg-[#262a31] text-[#dfe2eb] border border-[#84948e] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6fffd9] focus:border-transparent transition-all placeholder-[#b9cac3]/50"
//                   />
//                 </div>
//               </div>

//               {/* WhatsApp Number Field */}
//               <div className="space-y-2">
//                 <label
//                   htmlFor="whatsappNumber"
//                   className="block text-sm font-medium text-[#dfe2eb]"
//                 >
//                   WhatsApp Number{" "}
//                   <span className="text-[#84948e] text-xs font-normal">
//                     (Optional if Phone provided)
//                   </span>
//                 </label>
//                 <div className="flex gap-2">
//                   <div className="relative w-[100px] shrink-0">
//                     <select
//                       id="whatsappCountryCode"
//                       name="whatsappCountryCode"
//                       value={formData.whatsappCountryCode}
//                       onChange={handleChange}
//                       className="w-full appearance-none bg-[#262a31] text-[#dfe2eb] border border-[#84948e] rounded-lg pl-3 pr-8 py-3 focus:outline-none focus:ring-2 focus:ring-[#6fffd9] focus:border-transparent transition-all"
//                     >
//                       <option value="+91">+91 (IN)</option>
//                     </select>
//                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-[#b9cac3]">
//                       <span className="material-symbols-outlined text-[18px]">
//                         keyboard_arrow_down
//                       </span>
//                     </div>
//                   </div>

//                   <input
//                     type="tel"
//                     id="whatsappNumber"
//                     inputMode="numeric"
//                     name="whatsappNumber"
//                     value={formData.whatsappNumber}
//                     onChange={handleChange}
//                     maxLength={10}
//                     placeholder="(555) 000-0000"
//                     className="flex-1 w-full bg-[#262a31] text-[#dfe2eb] border border-[#84948e] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6fffd9] focus:border-transparent transition-all placeholder-[#b9cac3]/50"
//                   />
//                 </div>
//               </div>

//               {/* Highest Qualification Field */}
//               <div className="space-y-2">
//                 <label
//                   htmlFor="qualificationSelect"
//                   className="block text-sm font-medium text-[#dfe2eb]"
//                 >
//                   Highest Qualification <span className="text-red-400">*</span>
//                 </label>
//                 <div className="relative">
//                   <select
//                     id="qualificationSelect"
//                     value={selectedQualOption}
//                     onChange={handleDropdownChange}
//                     className="w-full appearance-none bg-[#262a31] text-[#dfe2eb] border border-[#84948e] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6fffd9] focus:border-transparent transition-all"
//                   >
//                     <option value="" disabled>
//                       Select Qualification
//                     </option>
//                     <option value="High School / 12th">High School / 12th</option>
//                     <option value="Diploma">Diploma</option>
//                     <option value="Bachelor's Degree">Bachelor's Degree</option>
//                     <option value="Master's Degree">Master's Degree</option>
//                     <option value="PhD">PhD</option>
//                     <option value="Other">Other</option>
//                   </select>
//                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-[#b9cac3]">
//                     <span className="material-symbols-outlined text-[18px]">
//                       keyboard_arrow_down
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Conditional Text Input for "Other" */}
//               {selectedQualOption === "Other" && (
//                 <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300 mt-4">
//                   <label
//                     htmlFor="highestQualification"
//                     className="block text-xs font-medium text-[#b9cac3]"
//                   >
//                     Please Specify Your Qualification{" "}
//                     <span className="text-red-400">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     id="highestQualification"
//                     name="highestQualification"
//                     value={formData.highestQualification}
//                     onChange={handleChange}
//                     placeholder="e.g., Associate Degree"
//                     className="w-full bg-[#262a31] text-[#dfe2eb] border border-[#84948e] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6fffd9] focus:border-transparent transition-all placeholder-[#b9cac3]/50"
//                   />
//                 </div>
//               )}

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`w-full flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-xl text-sm transition-colors duration-200 tracking-wide mb-5 
//                     ${loading ? "bg-[#4a7070] cursor-not-allowed opacity-80" : "bg-[#00d4aa] hover:bg-[#00bfa0] active:bg-[#00a88c] cursor-pointer"}`}
//               >
//                 {loading && (
//                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                 )}
//                 {loading ? "Saving Details..." : "Save Details"}
//               </button>
//             </form>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router";

interface FormData {
  phoneCountryCode: string;
  phoneNumber: string;
  whatsappCountryCode: string;
  whatsappNumber: string;
  highestQualification: string;
}

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

interface UpdateUserInfoResponse {
  updateUserInfo: {
    message: string;
    success: boolean;
  };
}

export default function UserDataCollectionForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as { redirectTo?: string; openPayment?: boolean } | null;

  const [updateUserInfo, { loading }] = useMutation<UpdateUserInfoResponse>(UPDATE_USER_INFO);

  const [formData, setFormData] = useState<FormData>({
    phoneCountryCode: "+91",
    phoneNumber: "",
    whatsappCountryCode: "+91",
    whatsappNumber: "",
    highestQualification: "",
  });

  const [selectedQualOption, setSelectedQualOption] = useState<string>("");

  const executeSave = async (dataToSave: FormData, isAutoSave = false) => {
    try {
      const phoneCodeInt = parseInt(dataToSave.phoneCountryCode.replace("+", ""), 10);
      const whatsappCodeInt = parseInt(dataToSave.whatsappCountryCode.replace("+", ""), 10);

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
        if (!isAutoSave) {
          if (state?.redirectTo && state?.openPayment) {
            navigate(state.redirectTo, { state: { openPayment: true } });
          } else if (state?.redirectTo) {
            navigate(state.redirectTo);
          } else {
            navigate("/courses");
          }
        }
      }
    } catch (error: any) {
      console.error("Mutation error:", error);
      if (!isAutoSave) toast.error(error.message || "An unexpected error occurred.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "phoneNumber" || name === "whatsappNumber") {
      const numericValue = value.replace(/\D/g, "");
      const updatedFormData = { ...formData, [name]: numericValue };
      setFormData(updatedFormData);

      if (numericValue.length === 10) {
        executeSave(updatedFormData, true);
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedQualOption(value);
    setFormData((prev) => ({ ...prev, highestQualification: value !== "Other" ? value : "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.phoneNumber.trim() && !formData.whatsappNumber.trim()) {
      toast.error("Please provide either a Phone Number or a WhatsApp Number.");
      return;
    }

    if (!formData.highestQualification.trim()) {
      toast.error("Please specify your highest qualification.");
      return;
    }

    await executeSave(formData, false);
  };

  return (
    <div className="min-h-screen bg-[#10141a] flex items-center justify-center p-4 font-['Inter',sans-serif]">
      <div className="w-full max-w-md bg-[#1c2026] rounded-2xl shadow-xl border border-[#3b4a44] overflow-hidden">
        <div>
          <div className="p-8 border-b border-[#3b4a44]">
            <h2 className="text-3xl font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#6fffd9] mb-2">
              Your Details
            </h2>
            <p className="text-sm text-[#b9cac3]">
              Please provide your contact information and qualifications.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-2">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-[#dfe2eb]">
                Phone Number <span className="text-[#84948e] text-xs font-normal">(Optional if WhatsApp provided)</span>
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
                    <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
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
                  className="flex-1 w-full bg-[#262a31] text-[#dfe2eb] border border-[#84948e] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6fffd9] focus:border-transparent transition-all placeholder-[#b9cac3]/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="whatsappNumber" className="block text-sm font-medium text-[#dfe2eb]">
                WhatsApp Number <span className="text-[#84948e] text-xs font-normal">(Optional if Phone provided)</span>
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
                    <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
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
                  className="flex-1 w-full bg-[#262a31] text-[#dfe2eb] border border-[#84948e] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6fffd9] focus:border-transparent transition-all placeholder-[#b9cac3]/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="qualificationSelect" className="block text-sm font-medium text-[#dfe2eb]">
                Highest Qualification <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  id="qualificationSelect"
                  value={selectedQualOption}
                  onChange={handleDropdownChange}
                  className="w-full appearance-none bg-[#262a31] text-[#dfe2eb] border border-[#84948e] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6fffd9] focus:border-transparent transition-all"
                >
                  <option value="" disabled>Select Qualification</option>
                  <option value="High School / 12th">High School / 12th</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Bachelor's Degree">Bachelor's Degree</option>
                  <option value="Master's Degree">Master's Degree</option>
                  <option value="PhD">PhD</option>
                  <option value="Other">Other</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-[#b9cac3]">
                  <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
                </div>
              </div>
            </div>

            {selectedQualOption === "Other" && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300 mt-4">
                <label htmlFor="highestQualification" className="block text-xs font-medium text-[#b9cac3]">
                  Please Specify Your Qualification <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="highestQualification"
                  name="highestQualification"
                  value={formData.highestQualification}
                  onChange={handleChange}
                  placeholder="e.g., Associate Degree"
                  className="w-full bg-[#262a31] text-[#dfe2eb] border border-[#84948e] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6fffd9] focus:border-transparent transition-all placeholder-[#b9cac3]/50"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-xl text-sm transition-colors duration-200 tracking-wide mb-5 
                  ${loading ? "bg-[#4a7070] cursor-not-allowed opacity-80" : "bg-[#00d4aa] hover:bg-[#00bfa0] active:bg-[#00a88c] cursor-pointer"}`}
            >
              {loading && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {loading ? "Saving Details..." : "Save Details"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}