import React, { useState } from "react";
import { gql } from "@apollo/client";
import { useLazyQuery } from "@apollo/client/react";
import { useNavigate } from "react-router";
import { google_login } from "../utils/googleauth";
import toast from "react-hot-toast";
import { useAuth } from "../context/authcontext";
import GoogleSVG from "../../../shared/svg/google";
import InputField from "../../../shared/components/inputfield";

// QUERY to get user data
const LOGIN_QUERY = gql`
  query login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      data {
        firstname
        lastname
        email
        role
      }
      message
      success
    }
  }
`;

// Response type of LOGIN
interface LoginData {
  login: {
    data: {
      firstname: string;
      lastname: string;
      email: string;
      role: string;
    } | null;
    message: string;
    success: boolean;
  };
}

// Query for check if the user fill-up the user-data collection form or not
const GET_USER_INFO = gql`
  query getUserInfo {
    getUserInfo {
      success
    }
  }
`;

// Response type of USER INFO
interface UserInfoData {
  getUserInfo: {
    success: boolean;
  };
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  // const [remember, setRemember] = useState(false);

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // Initialize Apollo Lazy Query
  const [loginUser, { loading, error }] = useLazyQuery<LoginData>(LOGIN_QUERY);
  const [fetchUserInfo] = useLazyQuery<UserInfoData>(GET_USER_INFO, {
    fetchPolicy: "network-only",
  });

  // Triggered when the input will be changed
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSave = async (event: any) => {
    event.preventDefault();

    // Basic validation
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      // Execute the query
      const { data, error } = await loginUser({
        variables: {
          email: formData.email,
          password: formData.password,
        },
      });

      if (error) {
        toast.error(error.message || "An error occurred during login.");
        return;
      }

      // Handle backend response
      if (data?.login.success && data.login.data) {
        toast.success(data.login.message || "Logged in successfully!");
        const userData = data.login.data;

        // Fetch User Info to check onboarding status
        const { data: userInfoData, error: userInfoError } =
          await fetchUserInfo();

        if (userInfoError || !userInfoData?.getUserInfo) {
          toast.error("Failed to verify user details.");
          return;
        }

        const isDetailsFilled =
          !userInfoError && userInfoData?.getUserInfo?.success === true;
        console.log("Isfilled", isDetailsFilled);

        login({
          firstname: userData.firstname || "",
          lastname: userData.lastname || "",
          email: userData.email,
          role: userData.role,
        });

        if (userData.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/courses");
        }

        // Clear input fields
        setFormData({ email: "", password: "" });
      } else {
        toast.error(data?.login.message || "Invalid credentials.");
      }
    } catch (err: any) {
      console.error("GraphQL Error:", err);
      toast.error(err.message || "An unexpected error occurred.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#10141a] flex items-center justify-center text-[#6fffd9]">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-[#10141a] flex items-center justify-center text-red-400">
        Error: {error.message}
      </div>
    );

  return (
    <div className="h-screen overflow-hidden flex bg-[#0a1515] font-sans">
      {/* LEFT PANEL */}
      <div
        className="hidden lg:flex lg:w-[52%] relative flex-col justify-center items-center px-10 py-8 overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg,#061818 0%,#0a1f1f 40%,#071515 100%)",
        }}
      >
        <div
          className="absolute top-[8%] -right-17.5 w-60 h-60 rounded-full border border-[#00d4aa]/8 pointer-events-none"
          style={{ animation: "spin 22s linear infinite" }}
        >
          <div className="absolute inset-2.5 rounded-full border border-dashed border-[#00d4aa]/5" />
          <div className="absolute inset-2.5 rounded-full border border-dashed border-[#00d4aa]/5" />
        </div>
        <div className="absolute top-1/3 left-1/3 w-90 h-90 rounded-full bg-[#00d4aa]/6 blur-[80px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-90 h-90 rounded-full bg-[#00d4aa]/6 blur-[80px] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#00d4aa 1px,transparent 1px),linear-gradient(90deg,#00d4aa 1px,transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        <div className="relative z-10 max-w-95 w-full">
          <div className="flex items-center gap-2.5 mb-5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg,#1a3a35,#0d2828)",
                border: "1px solid rgba(0,212,170,0.25)",
                boxShadow: "0 0 16px rgba(0,212,170,0.14)",
              }}
            >
              <img className="h-8" src="/favicon.svg" />
            </div>
            <div>
              <div className="text-white text-[18px] font-bold tracking-tight">
                Inquesta
              </div>
              <div className="text-[#3a6060] text-[9px] tracking-[0.15em] uppercase font-medium">
                Learning Platform
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h1 className="text-white text-[50px] font-extrabold leading-[1.2] tracking-tight mb-2">
              Pick up right
              <br />
              where you <span className="text-[#00d4aa]">left off.</span>
            </h1>
            <p className="text-[#5a8888] text-[13px] leading-[1.6]">
              Your dashboard, courses & progress are waiting for you.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div
        className="w-full lg:w-[48%] flex flex-col justify-center items-center px-6 sm:px-8 py-8 relative bg-[#0e1c1c] overflow-hidden"
        style={{ borderLeft: "1px solid rgba(0,212,170,0.07)" }}
      >
        <div className="absolute -top-12 -right-12 w-60 h-60 rounded-full bg-[#00d4aa]/5 blur-[70px] pointer-events-none" />
        <div className="absolute -top-12 -right-12 w-60 h-60 rounded-full bg-[#00d4aa]/5 blur-[70px] pointer-events-none" />

        <div className="flex lg:hidden items-center gap-2 mb-5">
          <div
            className="w-9 h-9 rounded-[10px] bg-[#1a3a35] flex items-center justify-center"
            style={{ border: "1px solid rgba(0,212,170,0.2)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 19V7a2 2 0 012-2h12a2 2 0 012 2v12"
                stroke="#00d4aa"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M4 19h16M9 7v4M15 7v4M12 7v4"
                stroke="#00d4aa"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-white text-[17px] font-bold">Inquesta</span>
        </div>

        <div className="w-full max-w-100 relative z-10">
          <div
            className="h-0.5 rounded-sm mb-5"
            style={{
              background:
                "linear-gradient(90deg,transparent,#00d4aa 40%,transparent)",
            }}
          />

          <h2 className="text-white text-[22px] font-extrabold tracking-tight mb-1">
            Sign in to Inquesta
          </h2>
          <p className="text-[#4a7070] text-[12.5px] mb-4">
            Access your courses, progress & community
          </p>

          <div className="flex flex-col gap-2.5 mb-3.5 lg:flex-row">
            {[
              {
                label: "Continue with Google",
                icon: <GoogleSVG />,
              },
            ].map((b) => (
              <button
                onClick={google_login}
                key={b.label}
                className="cursor-pointer flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-[10px] border border-[#1e3535] bg-[#0e1e1e] hover:bg-[#162929] hover:border-[#2a4848] text-white text-[12.5px] font-medium transition-all duration-200"
              >
                {b.icon}
                {b.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5 mb-3.5">
            <div
              className="flex-1 h-px"
              style={{
                background: "linear-gradient(90deg,transparent,#1e3535)",
              }}
            />
            <span className="text-[#2e5555] text-[10px] font-semibold tracking-widest uppercase">
              or sign in with email
            </span>
            <div
              className="flex-1 h-px"
              style={{
                background: "linear-gradient(90deg,#1e3535,transparent)",
              }}
            />
          </div>

          {/* Email */}
          <div className="mb-2.5">
            <InputField
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="you@example.com"
              icon={
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "22px" }}
                >
                  mail
                </span>
              }
              name="email"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[#7aafaf] text-[10px] font-semibold tracking-widest uppercase">
                Password
              </label>
              <a
                href="#"
                className="text-[#00d4aa] hover:text-[#00bfa0] text-[11px] font-medium transition-colors"
              >
                {/* Forgot password? */}
              </a>
            </div>
            <div className="relative">
              <InputField
                label=""
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a strong password"
                name="password"
                icon={
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "22px" }}
                  >
                    lock
                  </span>
                }
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer text-[#4a7070] hover:text-[#00d4aa] transition-colors"
                  >
                    {showPassword ? (
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "22px" }}
                      >
                        visibility
                      </span>
                    ) : (
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "22px" }}
                      >
                        visibility_off
                      </span>
                    )}
                  </button>
                }
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2.5 mb-4">
            {/* <div
              onClick={() => setRemember((v) => !v)}
              className={`w-3.75 h-3.75 rounded cursor-pointer flex items-center justify-center shrink-0 border transition-all duration-200 ${
                remember
                  ? "bg-[#00d4aa] border-[#00d4aa]"
                  : "bg-[#0c1a1a] border-[#1e3535]"
              }`}
            > */}
            {/* {remember && (
                <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="#061212"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )} */}
            {/* </div> */}
            {/* <span
              onClick={() => setRemember((v) => !v)}
              className="text-[#4a7070] text-[12px] cursor-pointer select-none"
            >
              Keep me signed in
            </span> */}
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full cursor-pointer bg-[#00d4aa] hover:bg-[#00bfa0] text-[#061212] font-bold text-[13.5px] tracking-wide py-2.75 rounded-[11px] mb-3.5 transition-colors duration-200"
          >
            {loading ? "Signing In..." : "Sign In →"}
          </button>

          <p className="text-center text-[#3a6060] text-[12.5px] mb-3">
            New to Inquesta?{" "}
            <a
              href="/register"
              className="text-[#00d4aa] hover:text-[#00bfa0] font-semibold transition-colors"
            >
              Create a free account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
