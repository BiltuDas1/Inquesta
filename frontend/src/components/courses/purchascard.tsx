import React, { useState } from "react";
import type { Course } from "../../types/courses";
import { useAuth } from "../../context/authcontext";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { gql } from "@apollo/client";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import { EnrollmentSuccess } from "./enrollmentsuccessmodal";

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

// Query to check if the user filled up the user-data collection form
const GET_USER_INFO = gql`
  query getUserInfo {
    getUserInfo {
      success
    }
  }
`;

interface UserInfoData {
  getUserInfo: {
    success: boolean;
  };
}

export const PurchaseCard: React.FC<PurchaseCardProps> = ({ course }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // ── Added State ──
  const [transactionId, setTransactionId] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  //  Fetch enrolled courses (skip if guest)
  const { data: enrollmentData, loading: checkingEnrollment } =
    useQuery<EnrolledCoursesResponse>(GET_ENROLLED_COURSES, {
      skip: !user,
    });

    //  Fetch User Info to check onboarding status
  const [fetchUserInfo] =
    useLazyQuery<UserInfoData>(GET_USER_INFO, {
      fetchPolicy: "network-only",
    });

  // Check if the current course ID exists in the user's list
  const isAlreadyEnrolled = enrollmentData?.enrolledCourses?.data?.some(
    (item: any) => String(item.id) === String(course.id),
  );

  const [enrollCourse, { loading: isSubmitting }] = useMutation<
    EnrollCourseResponse,
    EnrollCourseVariables
  >(ENROLL_COURSE_MUTATION);

const handleEnroll = async () => {
    if (!user) {
      toast.error("Please log in to enroll in this course.");
      navigate("/login");
      return;
    }

    // Bypass the onboarding check if the user is an admin
    if (user.role === "admin") {
      setIsModalOpen(true);
      return;
    }

    try {
      // Check onboarding status for regular users
      const { data: userInfoData, error: userInfoError } =
        await fetchUserInfo();

      if (userInfoError || !userInfoData?.getUserInfo?.success) {
        toast.error("Please complete your profile details before enrolling.");
        navigate("/onboard"); 
        return;
      }

      // If onboarding is complete, proceed to open modal
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error verifying user onboarding status:", err);
      toast.error("Failed to verify profile status. Please try again.");
    }
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
        refetchQueries: [{ query: GET_ENROLLED_COURSES }], // ── Refetch to update button ──
      });

      if (response.data) {
        const { success, message } = response.data.enrollCourse;

        if (success) {
          setShowSuccess(true); // ── Show success view instead of closing ──
          setTransactionId("");
        } else {
          toast.error(message || "Failed to submit payment details.");
        }
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

          <div className="mb-5 px-1">
            <p className="text-[#84948e] text-sm font-headline font-semibold mb-1">
              {isAlreadyEnrolled
                ? "You own this course"
                : "Buy individual course"}
            </p>
            <div className="flex items-baseline gap-1">
              <span className="material-symbols-outlined">currency_rupee</span>
              <span className="text-3xl font-black text-[#dfe2eb] tracking-tight">
                {course.price}
              </span>
            </div>
          </div>

          {isAlreadyEnrolled ? (
            <button
              onClick={() => navigate(`/courses`)}
              // Changed bg-transparent/border to solid bg-[#6fffd9] and dark text
              className="w-full bg-[#6fffd9] text-[#00382c] font-black py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(111,255,217,0.3)] text-base font-headline hover:bg-[#5cebc5] hover:scale-[1.02] active:scale-[0.98]"
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
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => !showSuccess && setIsModalOpen(false)} // Disable click-out on success
          />

          <div className="relative bg-[#1c2026] border border-[#3b4a44] rounded-2xl shadow-2xl w-full max-w-sm p-6 sm:p-8 z-10 animate-in fade-in zoom-in duration-200">
            {!showSuccess ? (
              <>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-[#84948e] hover:text-[#ffb4ab] transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>

                <h3 className="text-2xl font-bold text-[#dfe2eb] mb-1 font-headline">
                  Complete Payment
                </h3>
                <p className="text-[#b9cac3] text-sm mb-6">
                  Scan the QR code to pay{" "}
                  <span className="text-[#6fffd9] font-bold">
                    ₹{course.price}
                  </span>
                </p>

                <div className="  flex items-center justify-center mx-auto mb-6 w-82 h-82  relative overflow-hidden">
                  <img
                    src={`https://duqixbhmkyazlglmfopk.supabase.co/storage/v1/object/public/Inquesta/uploads/inquesta_QR.jpg`}
                    alt="Payment QR Code"
                    className="w-full h-full object-contain select-none"
                    style={{
                      imageRendering: "pixelated",
                    }}
                    draggable={false}
                    crossOrigin="anonymous"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-xs font-bold text-[#84948e] uppercase tracking-wider mb-2">
                    Transaction ID
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

                <button
                  onClick={handleSubmitPayment}
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center gap-2 bg-[#6fffd9] hover:bg-[#5cebc5] text-[#00382c] font-black py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(111,255,217,0.2)] text-base font-headline active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait"
                >
                  {isSubmitting ? "Submitting..." : "Submit for Verification"}
                </button>
              </>
            ) : (
              <EnrollmentSuccess
                courseTitle={course.title}
                onClose={() => {
                  setIsModalOpen(false);
                  setShowSuccess(false);
                }}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};
