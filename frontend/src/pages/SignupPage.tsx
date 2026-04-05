import {BookOpen, Eye, EyeOff, GraduationCap, Mail, Star} from "lucide-react";
import {useState} from "react";

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const inputBase =
        "w-full bg-[#0c1c1c] border border-[#1a3030] focus:border-[#00d4aa]/55 focus:outline-none focus:ring-2 focus:ring-[#00d4aa]/10 text-white placeholder-[#2d5050] rounded-[10px] py-2.5 text-[13px] transition-all duration-200";
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
                        <span className="text-white text-xl font-semibold tracking-wide">Inquesta</span>
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
                                icon: <Star size={18} />,
                                text: "AI-powered personalized learning paths",
                            },
                            {
                                icon: <GraduationCap size={18} />,
                                text: "Expert-led courses with certifications",
                            },
                            {
                                icon: <BookOpen size={18} />,
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
                                <span className="text-[#c5dede] text-sm font-medium">{item.text}</span>
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
                    <h2 className="text-white text-2xl sm:text-3xl font-bold mb-1">Create Your Account</h2>
                    <p className="text-[#6a8f8f] text-sm mb-7">Join thousands of learners on Luminary</p>

                    {/* Social buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        <button className="flex-1 flex items-center justify-center gap-2  cursor-pointer bg-[#1b2e2e] hover:bg-[#1f3535] border border-[#2a4040] text-white text-sm font-medium py-3 px-4 rounded-xl transition-colors duration-200">
                            <svg width="18" height="18" viewBox="0 0 24 24">
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
                            Continue with Google
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 cursor-pointer bg-[#1b2e2e] hover:bg-[#1f3535] border border-[#2a4040] text-white text-sm font-medium py-3 px-4 rounded-xl transition-colors duration-200">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <rect x="2" y="2" width="9" height="9" fill="#F25022" />
                                <rect x="13" y="2" width="9" height="9" fill="#7FBA00" />
                                <rect x="2" y="13" width="9" height="9" fill="#00A4EF" />
                                <rect x="13" y="13" width="9" height="9" fill="#FFB900" />
                            </svg>
                            Continue with Microsoft
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex-1 h-px bg-[#1e3535]" />
                        <span className="text-[#4a7070] text-xs">OR SIGN UP WITH EMAIL</span>
                        <div className="flex-1 h-px bg-[#1e3535]" />
                    </div>

                    {/* Name row */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <div className="flex-1">
                            <label className="block text-[#c5dede] text-sm font-medium mb-1.5">First Name</label>
                            <input
                                type="text"
                                placeholder="John"
                                className="w-full bg-[#162626] border border-[#1e3535] focus:border-[#00d4aa]/50 focus:outline-none  text-slate-200 placeholder-slate-500 rounded-xl px-4 py-3 text-sm transition-colors duration-200"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-[#c5dede] text-sm font-medium mb-1.5">Last Name</label>
                            <input
                                type="text"
                                placeholder="Doe"
                                className="w-full bg-[#162626] border border-[#1e3535] focus:border-[#00d4aa]/50 focus:outline-none text-slate-200 placeholder-slate-500 rounded-xl px-4 py-3 text-sm transition-colors duration-200"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    {/* <div className="mb-4">
                        <label className="block text-[#c5dede] text-sm font-medium mb-1.5">Email Address</label>
                        <input
                            type="email"
                            placeholder="john.doe@example.com"
                            className="w-full bg-[#162626] border border-[#1e3535] focus:border-[#00d4aa]/50 focus:outline-none text-slate-200 placeholder-slate-500 rounded-xl px-4 py-3 text-sm transition-colors duration-200"
                        />
                    </div> */}
                    <div className="mb-2.5">
                        <label className="block text-[#7aafaf] text-[10px] font-semibold tracking-widest uppercase mb-1.5">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a6060] pointer-events-none flex">
                                <Mail size={18} />
                            </div>
                            <input type="email" placeholder="you@example.com" className={`${inputBase} pl-9 pr-4`} />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <label className="block text-[#c5dede] text-sm font-medium mb-1.5">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a strong password"
                                className="w-full bg-[#162626] border border-[#1e3535] focus:border-[#00d4aa]/50 focus:outline-none text-slate-200 placeholder-slate-500 rounded-xl px-4 py-3 pr-11 text-sm transition-colors duration-200"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#4a7070] hover:text-[#00d4aa] transition-colors"
                            >
                                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-6">
                        <label className="block text-[#c5dede] text-sm font-medium mb-1.5">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                placeholder="Re-enter your password"
                                className="w-full bg-[#162626] border border-[#1e3535] focus:border-[#00d4aa]/50 focus:outline-none text-slate-200 placeholder-slate-500 rounded-xl px-4 py-3 pr-11 text-sm transition-colors duration-200"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#4a7070] hover:text-[#00d4aa] transition-colors"
                            >
                                {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* CTA */}
                    <button className="w-full text-white bg-[#00d4aa] hover:bg-[#00bfa0] active:bg-[#00a88c] cursor-pointer font-semibold py-3.5 rounded-xl text-sm transition-colors duration-200 tracking-wide mb-5">
                        Create Account
                    </button>

                    {/* Login link */}
                    <p className="text-center text-[#4a7070] text-sm">
                        Already have an account?{" "}
                        <a href="#" className="text-[#00d4aa] hover:text-[#00bfa0] font-medium transition-colors">
                            Log in
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
