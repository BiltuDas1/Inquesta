import { useState } from "react";
import InputField from "../components/ui/inputfield";

const stats = [
  { value: "120K+", label: "Active Learners" },
  { value: "4.9★", label: "Avg Rating" },
  { value: "2,400+", label: "Courses" },
];

const features = [
  {
    icon: <span className="material-symbols-outlined">star</span>,
    title: "AI-Personalized Paths",
    sub: "Tailored to your pace & goals",
  },
  {
    icon: <span className="material-symbols-outlined">psychology_alt</span>,
    title: "Expert Instructors",
    sub: "Industry-certified educators",
  },
  {
    icon: <span className="material-symbols-outlined">crowdsource</span>,
    title: "Live Collaboration",
    sub: "Real-time peer learning",
  },
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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

          <div className="flex gap-2 mb-3.5">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex-1 text-center rounded-[10px] px-2 py-2"
                style={{
                  background: "rgba(0,212,170,0.07)",
                  border: "1px solid rgba(0,212,170,0.15)",
                }}
              >
                <div className="text-[#00d4aa] text-[15px] font-extrabold leading-none">
                  {s.value}
                </div>
                <div className="text-[#4a7070] text-[9.5px] mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-1.5 mb-3.5">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex items-center gap-2.5 px-3 py-2 rounded-[10px] border border-white/5 bg-white/2 hover:bg-[#00d4aa]/6 hover:border-[#00d4aa]/20 transition-all duration-200"
              >
                <div
                  className="w-7.5 h-7.5 rounded-lg flex items-center justify-center shrink-0 text-[#00d4aa]"
                  style={{
                    background: "rgba(0,212,170,0.1)",
                    border: "1px solid rgba(0,212,170,0.15)",
                  }}
                >
                  {f.icon}
                </div>
                <div>
                  <div className="text-[#d0e8e8] text-[12px] font-semibold">
                    {f.title}
                  </div>
                  <div className="text-[#3a6060] text-[10.5px] mt-0.5">
                    {f.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(0,212,170,0.12)",
            }}
          >
            <div
              className="w-8.5 h-8.5 rounded-full shrink-0 flex items-center justify-center font-bold text-[#061212] text-[13px]"
              style={{ background: "linear-gradient(135deg,#00d4aa,#0099aa)" }}
            >
              S
            </div>
            <div className="flex-1">
              <div className="text-[#c5dede] text-[11px] leading-normal">
                "Inquesta transformed how I learn — 3 certifications in 2
                months!"
              </div>
              <div className="text-[#3a6060] text-[10px] mt-0.5">
                Sarah K. · UX Designer
              </div>
            </div>
            <div className="text-[#00d4aa] text-[11px] shrink-0">★★★★★</div>
            <div className="text-[#00d4aa] text-[11px] shrink-0">★★★★★</div>
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
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                ),
              },
              {
                label: "Continue with Microsoft",
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="2" width="9" height="9" fill="#F25022" />
                    <rect x="13" y="2" width="9" height="9" fill="#7FBA00" />
                    <rect x="2" y="13" width="9" height="9" fill="#00A4EF" />
                    <rect x="13" y="13" width="9" height="9" fill="#FFB900" />
                  </svg>
                ),
              },
            ].map((b) => (
              <button
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
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <InputField
                label=""
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
          </div>

          <div className="flex items-center gap-2 mt-2.5 mb-4">
            <div
              onClick={() => setRemember((v) => !v)}
              className={`w-3.75 h-3.75 rounded cursor-pointer flex items-center justify-center shrink-0 border transition-all duration-200 ${
                remember
                  ? "bg-[#00d4aa] border-[#00d4aa]"
                  : "bg-[#0c1a1a] border-[#1e3535]"
              }`}
            >
              {remember && (
                <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="#061212"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <span
              onClick={() => setRemember((v) => !v)}
              className="text-[#4a7070] text-[12px] cursor-pointer select-none"
            >
              Keep me signed in
            </span>
          </div>

          <button className="w-full cursor-pointer bg-[#00d4aa] hover:bg-[#00bfa0] text-[#061212] font-bold text-[13.5px] tracking-wide py-2.75 rounded-[11px] mb-3.5 transition-colors duration-200">
            Sign In →
          </button>

          <p className="text-center text-[#3a6060] text-[12.5px] mb-3">
            New to Inquesta?{" "}
            <a
              href="#"
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
