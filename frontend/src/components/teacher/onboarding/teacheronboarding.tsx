import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

// ── GraphQL ──
// This fetches the teacher's initial details using the ID from the URL
const GET_TEACHER_INVITE_QUERY = gql`
  query GetTeacherInfo($teacherId: String!) {
    getTeacherInfo(teacherId: $teacherId) {
      success
      data {
        id
        firstname
        lastname
        email
      }
    }
  }
`;

interface GetTeacherInviteResponse {
  getTeacherInfo: {
    success: boolean;
    data: {
      id: string;
      firstname: string;
      lastname: string | null;
      email: string;
    } | null;
  };
}

// This mutation saves their password and qualification to activate the account
const COMPLETE_ONBOARDING_MUTATION = gql`
  mutation CompleteTeacherOnboarding(
    $teacherId: String!
    $password: String!
    $qualification: String!
  ) {
    addedTeacherDetails(
      teacherId: $teacherId
      password: $password
      qualification: $qualification
    ) {
      success
      message
    }
  }
`;

interface CompleteOnboardingResponse {
  addedTeacherDetails: {
    success: boolean;
    message: string;
  };
}

export default function TeacherOnboarding() {
  // 1. Get the teacherId from the URL (e.g., ?teacherId=UUID)
  const [teacherId, setTeacherId] = useState<string | null>(null);

  // 2. Form State
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [qualification, setQualification] = useState("");

  // Grab the ID from the URL when the page loads
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("teacherId");
    if (id) setTeacherId(id);
  }, []);

  // 3. Apollo Hooks
  const { data: inviteData, loading: isLoadingInvite } = useQuery<GetTeacherInviteResponse>(GET_TEACHER_INVITE_QUERY, {
    variables: { teacherId },
    skip: !teacherId, // Don't run the query until we have the ID
  });

  const [completeSetup, { loading: isSaving }] = useMutation<CompleteOnboardingResponse>(COMPLETE_ONBOARDING_MUTATION);

  // 4. Pre-fill the form when the DB returns the invite data
  useEffect(() => {
    if (inviteData?.getTeacherInfo?.data) {
      const teacher = inviteData.getTeacherInfo.data;
      setFirstname(teacher.firstname || "");
      setLastname(teacher.lastname || "");
      setEmail(teacher.email || "");
    }
  }, [inviteData]);

  // 5. Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!", {
        style: { background: "#1c2026", color: "#ffb4ab", border: "1px solid #93000a" },
      });
      return;
    }

    if (!teacherId) return;

    try {
      const response = await completeSetup({
        variables: {
          teacherId,
          password,
          qualification,
        },
      });

      if (response.data?.addedTeacherDetails?.success) {
        toast.success("Account setup complete! Redirecting to login...", {
          style: { background: "#1c2026", color: "#dfe2eb", border: "1px solid #3b4a44" },
          iconTheme: { primary: "#6fffd9", secondary: "#00382c" },
        });
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          window.location.href = "/login"; // Adjust this to your actual login route
        }, 2000);
      } else {
        toast.error(response.data?.addedTeacherDetails?.message || "Setup failed.", {
          style: { background: "#1c2026", color: "#ffb4ab", border: "1px solid #93000a" },
        });
      }
    } catch (error) {
      console.error("Setup error:", error);
      toast.error("An error occurred. Please try again.", {
        style: { background: "#1c2026", color: "#ffb4ab", border: "1px solid #93000a" },
      });
    }
  };

  // If the link is invalid or missing the ID
  if (!teacherId) {
    return (
      <div className="min-h-screen bg-[#10141a] flex items-center justify-center p-4">
        <div className="bg-[#1c2026] border border-[#3b4a44] p-8 rounded-2xl text-center max-w-md w-full">
          <span className="material-symbols-outlined text-5xl text-[#ffb4ab] mb-4">link_off</span>
          <h1 className="text-xl font-bold text-[#dfe2eb] mb-2">Invalid Invitation Link</h1>
          <p className="text-[#84948e]">We couldn't find your setup ID. Please check the link in your email and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#10141a] font-body text-[#dfe2eb] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" />

      {/* ── Brand / Header Area ── */}
      <div className="mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-16 h-16 bg-[#1c2026] border border-[#3b4a44] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(111,255,217,0.1)]">
          <span className="material-symbols-outlined text-[32px] text-[#6fffd9]">school</span>
        </div>
        <h1 className="text-3xl font-headline font-bold text-[#dfe2eb]">Complete Your Profile</h1>
        <p className="text-[#84948e] mt-2 max-w-sm mx-auto">
          Welcome to Luminary! Please confirm your details and set a password to activate your teacher account.
        </p>
      </div>

      {/* ── Main Form Card ── */}
      <div className="w-full max-w-2xl bg-[#1c2026] border border-[#3b4a44] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-700">
        
        {isLoadingInvite ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <span className="material-symbols-outlined animate-spin text-[40px] text-[#6fffd9] mb-4">progress_activity</span>
            <p className="text-[#84948e]">Loading your invitation details...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[75vh]">
            
            {/* ── SCROLLABLE FORM AREA ── */}
            {/* If you add more fields later, this area will automatically scroll! */}
            <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar space-y-6">
              
              {/* Personal Info Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#6fffd9] uppercase tracking-wider">Personal Information</h3>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 space-y-1.5">
                    <label className="text-sm font-semibold text-[#b9cac3]">First Name</label>
                    <input 
                      readOnly type="text" value={firstname}
                      className="w-full bg-[#10141a]/50 border border-[#3b4a44]/50 text-[#84948e] px-4 py-3 rounded-lg focus:outline-none cursor-not-allowed"
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="text-sm font-semibold text-[#b9cac3]">Last Name</label>
                    <input 
                      readOnly type="text" value={lastname}
                      className="w-full bg-[#10141a]/50 border border-[#3b4a44]/50 text-[#84948e] px-4 py-3 rounded-lg focus:outline-none cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#b9cac3]">Email Address</label>
                  <input 
                    readOnly type="email" value={email}
                    className="w-full bg-[#10141a]/50 border border-[#3b4a44]/50 text-[#84948e] px-4 py-3 rounded-lg focus:outline-none cursor-not-allowed"
                  />
                  <p className="text-xs text-[#84948e] mt-1">Your name and email were set by your administrator.</p>
                </div>
              </div>

              <hr className="border-[#3b4a44]" />

              {/* Professional Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#6fffd9] uppercase tracking-wider">Professional Details</h3>
                
                <div className="space-y-1.5">
                  <label htmlFor="qualification" className="text-sm font-semibold text-[#b9cac3]">Highest Qualification <span className="text-[#ffb4ab]">*</span></label>
                  <input 
                    id="qualification" required disabled={isSaving} type="text" 
                    value={qualification} onChange={(e) => setQualification(e.target.value)}
                    placeholder="e.g. Master's in Mathematics"
                    className="w-full bg-[#10141a] border border-[#3b4a44] text-[#dfe2eb] px-4 py-3 rounded-lg focus:outline-none focus:border-[#6fffd9] focus:ring-1 focus:ring-[#6fffd9] transition-all"
                  />
                </div>
                
                {/* 💡 You can easily drop new fields right here later! */}
              </div>

              <hr className="border-[#3b4a44]" />

              {/* Security Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#6fffd9] uppercase tracking-wider">Security Setup</h3>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 space-y-1.5">
                    <label htmlFor="password" className="text-sm font-semibold text-[#b9cac3]">Create Password <span className="text-[#ffb4ab]">*</span></label>
                    <input 
                      id="password" required disabled={isSaving} type="password" 
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" minLength={8}
                      className="w-full bg-[#10141a] border border-[#3b4a44] text-[#dfe2eb] px-4 py-3 rounded-lg focus:outline-none focus:border-[#6fffd9] focus:ring-1 focus:ring-[#6fffd9] transition-all"
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label htmlFor="confirmPassword" className="text-sm font-semibold text-[#b9cac3]">Confirm Password <span className="text-[#ffb4ab]">*</span></label>
                    <input 
                      id="confirmPassword" required disabled={isSaving} type="password" 
                      value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••" minLength={8}
                      className="w-full bg-[#10141a] border border-[#3b4a44] text-[#dfe2eb] px-4 py-3 rounded-lg focus:outline-none focus:border-[#6fffd9] focus:ring-1 focus:ring-[#6fffd9] transition-all"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* ── Fixed Footer Actions ── */}
            {/* This stays pinned to the bottom of the card while the inner content scrolls! */}
            <div className="p-6 border-t border-[#3b4a44] bg-[#262a31]/30 flex items-center justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className={`w-full sm:w-auto px-8 py-3 rounded-lg font-headline font-semibold flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-[#6fffd9] focus:ring-offset-2 focus:ring-offset-[#1c2026] ${
                  isSaving 
                    ? "bg-[#6fffd9]/60 text-[#00382c]/60 cursor-not-allowed" 
                    : "bg-[#6fffd9] hover:bg-[#00e5bc] text-[#00382c] shadow-[0_0_15px_rgba(111,255,217,0.15)]"
                }`}
              >
                {isSaving ? (
                  <><span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>Activating Account...</>
                ) : (
                  "Complete Setup"
                )}
              </button>
            </div>
            
          </form>
        )}
      </div>
    </div>
  );
}