import { useState } from "react";
import InputField from "../components/ui/inputfield";
import GoogleSVG from "../components/svg/google";

const getGoogleAuthUrl = () => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  const options = {
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_GOOGLE_AUTH_REDIRECT_URL, 
    response_type: "code",
    prompt: "select_account",
    access_type: "offline",
    
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const queryString = new URLSearchParams(options).toString();
  return `${rootUrl}?${queryString}`;
};

function google_login() {
  window.location.href = getGoogleAuthUrl();
}

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  return (
    <div className="min-h-screen flex bg-[#0e1a1a] font-sans">
      {/* LEFT PANEL — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center items-center px-12 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-[#0a1f1f] via-[#0e1a1a] to-[#061212]" />
        {/* Subtle radial glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 rounded-full bg-[#00d4aa]/5 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-120 text-center">
          {/* Logo */}
          <div className="flex items-center justify-start gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-[#1a3a35] flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
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
            <span className="text-white text-xl font-semibold tracking-wide">
              Inquesta
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl xl:text-5xl font-bold  text-white mb-5 text-left flex flex-col">
            <p>Illuminate Your</p>

            <p>
              <span className="text-[#00d4aa]">Learning</span> Journey
            </p>
          </h1>

          <p className="text-[#8aabb0] text-base leading-relaxed mb-10 text-left">
            Access world-class courses, collaborate with peers,
            <br className="hidden xl:block" />
            and achieve your goals — all in one powerful platform.
          </p>

          {/* Feature pills */}
          <div className="flex flex-col gap-3 text-left">
            {[
              {
                icon: <span className="material-symbols-outlined ">star</span>,
                text: "AI-powered personalized learning paths",
              },
              {
                icon: <span className="material-symbols-outlined">school</span>,
                text: "Expert-led courses with certifications",
              },
              {
                icon: (
                  <span className="material-symbols-outlined">menu_book</span>
                ),
                text: "Interactive content & real-time collaboration",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-[#132424]/80 border border-[#1e3535] rounded-xl px-4 py-3 backdrop-blur-sm"
              >
                <div className="shrink-0 w-8 h-8 rounded-lg bg-[#1a3a35] flex items-center justify-center text-[#00d4aa]">
                  {item.icon}
                </div>
                <span className="text-[#c5dede] text-sm font-medium">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — full width on mobile, half on lg */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 sm:px-10 py-10 relative bg-[#111c1c]">
        {/* Subtle top glow */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#00d4aa]/5 blur-[80px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <h2 className="text-white text-2xl sm:text-3xl font-bold mb-1">
            Create Your Account
          </h2>
          <p className="text-[#6a8f8f] text-sm mb-7">
            Join thousands of learners on Luminary
          </p>

          {/* Social buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button className="flex-1 flex items-center justify-center gap-2  cursor-pointer bg-[#1b2e2e] hover:bg-[#1f3535] border border-[#2a4040] text-white text-sm font-medium py-3 px-4 rounded-xl transition-colors duration-200" onClick={google_login}>
              <GoogleSVG />
              Continue with Google
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[#1e3535]" />
            <span className="text-[#4a7070] text-xs">
              OR SIGN UP WITH EMAIL
            </span>
            <div className="flex-1 h-px bg-[#1e3535]" />
          </div>

          {/* Name row */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <InputField
                label="First Name"
                type="text"
                placeholder="John"
                icon={
                  <span
                    className="material-symbols-outlined "
                    style={{ fontSize: "22px" }}
                  >
                    account_circle
                  </span>
                }
                name="email"
              />
            </div>
            <div className="flex-1">
              <InputField
                label="Last Name"
                type="text"
                placeholder="Doe"
                icon={
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "22px" }}
                  >
                    account_circle
                  </span>
                }
                name="email"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-2.5">
            <InputField
              label="Email Address"
              type="email"
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
            <InputField
              label="Password"
              type={showPassword ? "text" : "password"}
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

          {/* Confirm Password */}
          <div className="mb-6">
            <InputField
              label="Confirm Password"
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter a password"
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
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="cursor-pointer text-[#4a7070] hover:text-[#00d4aa] transition-colors"
                >
                  {showConfirm ? (
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

          {/* CTA */}
          <button className="w-full text-white bg-[#00d4aa] hover:bg-[#00bfa0] active:bg-[#00a88c] cursor-pointer font-semibold py-3.5 rounded-xl text-sm transition-colors duration-200 tracking-wide mb-5">
            Create Account
          </button>

          {/* Login link */}
          <p className="text-center text-[#4a7070] text-sm">
            Already have an account?{" "}
            <a
              href="#"
              className="text-[#00d4aa] hover:text-[#00bfa0] font-medium transition-colors"
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
