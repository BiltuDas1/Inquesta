import React, { useState } from "react";
import type { Course } from "../../types/courses";
import { useAuth } from "../../context/authcontext";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";

interface PurchaseCardProps {
  course: Course;
}

const ENROLL_COURSE_MUTATION = gql`
  mutation enrollCourse($courseID: String!, $transactionID: String!) {
    enrollCourse(courseID: $courseID, transactionID: $transactionID) {
      message
      success
    }
  }
`;

interface EnrollCourseResponse {
  enrollCourse: {
    success: boolean;
    message: string;
  };
}

interface EnrollCourseVariables {
  courseID: string;
  transactionID: string;
}

// Query to get user's enrolled courses
const GET_ENROLLED_COURSES = gql`
  query enrolledCourses {
    enrolledCourses {
      data {
        id
      }
    }
  }
`;

interface EnrolledCoursesResponse {
  enrolledCourses: {
    data: Array<{
      id: string;
    }>;
  };
}

export const PurchaseCard: React.FC<PurchaseCardProps> = ({ course }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionId, setTransactionId] = useState("");

 

  const { user } = useAuth();
  const navigate = useNavigate();

  // 1. Fetch enrolled courses (skip if guest)
  const { data: enrollmentData, loading: checkingEnrollment } = useQuery<EnrolledCoursesResponse>(GET_ENROLLED_COURSES, {
    skip: !user,
  });

  // 2. Check if the current course ID exists in the user's list
  const isAlreadyEnrolled = enrollmentData?.enrolledCourses?.data?.some(
    (item: any) => item.id === course.id
  );

   const [enrollCourse, { loading: isSubmitting }] = useMutation<
    EnrollCourseResponse,
    EnrollCourseVariables
  >(ENROLL_COURSE_MUTATION);
  const handleEnroll = () => {
    //  Check if the user is authenticated
    if (!user) {
      toast.error("Please log in to enroll in this course.");
      navigate("/login");
      return;
    }

    //.If authenticated, open the payment modal
    setIsModalOpen(true);
  };

  // Handle Payment
  const handleSubmitPayment = async () => {
    if (!transactionId.trim()) {
      toast.error("Please enter a valid Transaction / UTR ID.");
      return;
    }

    try {
      const response = await enrollCourse({
        variables: {
          courseID: String(course.id),
          transactionID: transactionId.trim(),
        },
      });

      if (response.data) {
        const { success, message } = response.data.enrollCourse;

        if (success) {
          toast.success(message || "Payment details submitted successfully!");
          setIsModalOpen(false);
          setTransactionId("");
        } else {
          toast.error(message || "Failed to submit payment details.");
        }
        navigate("/courses")
      } else {
        toast.error("No response received from the server.");
      }
    } catch (error: any) {
      console.error("Enrollment error:", error);
      toast.error(
        error.message || "An unexpected error occurred. Please try again.",
      );
    }
  };

  return (
    <>
      <aside className="w-full md:w-[300px] lg:w-[340px] flex-shrink-0 order-1 md:order-2 z-10 md:sticky md:top-24 lg:top-28 md:-mt-[180px] lg:-mt-[280px]">
        <div className="bg-[#1c2026] border border-[#3b4a44] rounded-2xl shadow-2xl p-5 font-body relative">
          {/* Course Image */}
          <div className="w-full h-40 mb-5 rounded-xl overflow-hidden border border-[#2a342f] bg-[#181c22]">
            <img
              src={`${import.meta.env.VITE_SUPERBASE_PUBLIC_URL}/${course.icon}`}
              alt={course.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600";
              }}
            />
          </div>

          {/* Clean Price Display */}
          <div className="mb-5 px-1">
            <p className="text-[#84948e] text-sm font-headline font-semibold mb-1">
             {isAlreadyEnrolled ? "You own this course" : "Buy individual course"}
            </p>
            <div className="flex items-baseline gap-1">
              <span className="material-symbols-outlined">currency_rupee</span>
              <span className="text-3xl font-black text-[#dfe2eb] tracking-tight">
                {course.price}
              </span>
            </div>
          </div>

          {/* Enroll Button */}
          {/* <button
            onClick={handleEnroll}
            className="w-full bg-gradient-to-r from-[#343d96] to-[#4a55c2] hover:from-[#4a55c2] hover:to-[#5c68d6] text-white font-black py-3.5 rounded-xl transition-all shadow-lg text-base font-headline active:scale-[0.98]"
          >
            Enroll Now

          </button> */}
          {/* Conditional Button Rendering */}
          {isAlreadyEnrolled ? (
            <button
              onClick={() => navigate(`/courses`)} 
              className="w-full bg-[#181c22] border-2 border-[#6fffd9] text-[#6fffd9] font-black py-3.5 rounded-xl transition-all shadow-lg text-base font-headline hover:bg-[#6fffd9] hover:text-[#00382c]"
            >
              Go to Dashboard
            </button>
          ) : (
            <button
              onClick={handleEnroll}
              disabled={checkingEnrollment}
              className="w-full bg-gradient-to-r from-[#343d96] to-[#4a55c2] hover:from-[#4a55c2] hover:to-[#5c68d6] text-white font-black py-3.5 rounded-xl transition-all shadow-lg text-base font-headline active:scale-[0.98] disabled:opacity-50"
            >
              {checkingEnrollment ? "Checking..." : "Enroll Now"}
            </button>
          )}
        </div>
      </aside>

      {/* --- PAYMENT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-body">
          {/* Dark Blur Overlay */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-[#1c2026] border border-[#3b4a44] rounded-2xl shadow-2xl w-full max-w-sm p-6 sm:p-8 z-10 animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[#84948e] hover:text-[#ffb4ab] transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {/* Modal Header */}
            <h3 className="text-2xl font-bold text-[#dfe2eb] mb-1 font-headline">
              Complete Payment
            </h3>
            <p className="text-[#b9cac3] text-sm mb-6">
              Scan the QR code to pay{" "}
              <span className="text-[#6fffd9] font-bold">₹{course.price}</span>
            </p>

            {/* QR Code Scanner Area */}
            <div className="bg-white p-3 rounded-xl flex items-center justify-center mx-auto mb-6 w-48 h-48 border-4 border-[#3b4a44] shadow-inner">
              {/* NOTE: Replace 'your_upi_id@bank' with your actual UPI ID below to generate a real working QR code */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=your_upi_id@bank&pn=Inquesta&am=${course.price}&cu=INR`}
                alt="Payment QR Code"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Transaction ID Input */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-[#84948e] uppercase tracking-wider mb-2">
                Transaction / UTR ID
              </label>

              <input
                type="text"
                disabled={isSubmitting}
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g. 312345678901"
                className="w-full bg-[#10141a] border border-[#3b4a44] rounded-xl px-4 py-3 text-[#dfe2eb] text-sm focus:outline-none focus:border-[#6fffd9] transition-colors placeholder:text-[#3b4a44]"
              />
            </div>

            {/* Submit Payment Button */}
            <button
              onClick={handleSubmitPayment}
              disabled={isSubmitting} // ⬅️ USED HERE: Prevents double-clicking
              className="w-full flex justify-center items-center gap-2 bg-[#6fffd9] hover:bg-[#5cebc5] text-[#00382c] font-black py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(111,255,217,0.2)] text-base font-headline active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait"
            >
              {/* ⬅ USED HERE: Changes text dynamically */}
              {isSubmitting ? "Submitting..." : "Submit for Verification"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
