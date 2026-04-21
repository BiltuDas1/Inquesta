
// import { useLocation, Link } from "react-router";
// import { useEffect, useState } from "react";

// export default function CheckEmailPage() {
//   const location = useLocation();
//   const email = location.state?.email || "your email address";
//   const [resendCooldown, setResendCooldown] = useState(0);
//   const [pulse, setPulse] = useState(false);

//   useEffect(() => {
//     if (resendCooldown > 0) {
//       const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
//       return () => clearTimeout(t);
//     }
//   }, [resendCooldown]);

//   const openEmailApp = () => {
//     const emailLower = email.toLowerCase();
//     if (emailLower.includes("@gmail.com")) {
//       window.open("https://mail.google.com/", "_blank");
//     } else if (emailLower.includes("@yahoo.com")) {
//       window.open("https://mail.yahoo.com/", "_blank");
//     } else if (
//       emailLower.includes("@outlook.com") ||
//       emailLower.includes("@hotmail.com")
//     ) {
//       window.open("https://outlook.live.com/", "_blank");
//     } else {
//       alert("Please open your email client to check for the verification link.");
//     }
//   };

//   const handleResend = () => {
//     setPulse(true);
//     setTimeout(() => setPulse(false), 600);
//     setResendCooldown(30);
//   };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
//         @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0');

//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//         .page-root {
//           min-height: 100vh;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           background-color: #0e1a1a;
//           font-family: 'DM Sans', sans-serif;
//           padding: 24px;
//           position: relative;
//           overflow: hidden;
//         }

//         /* Layered background geometry */
//         .bg-ring {
//           position: absolute;
//           border-radius: 50%;
//           border: 1px solid rgba(0,212,170,0.07);
//           animation: ring-spin linear infinite;
//           pointer-events: none;
//         }
//         .bg-ring-1 { width: 600px; height: 600px; top: 50%; left: 50%; transform: translate(-50%, -50%); animation-duration: 40s; }
//         .bg-ring-2 { width: 480px; height: 480px; top: 50%; left: 50%; transform: translate(-50%, -50%); border-color: rgba(0,212,170,0.05); animation-duration: 28s; animation-direction: reverse; }
//         .bg-ring-3 { width: 360px; height: 360px; top: 50%; left: 50%; transform: translate(-50%, -50%); border-color: rgba(0,212,170,0.09); animation-duration: 20s; }

//         @keyframes ring-spin {
//           from { transform: translate(-50%, -50%) rotate(0deg); }
//           to   { transform: translate(-50%, -50%) rotate(360deg); }
//         }

//         .bg-glow-tl {
//           position: absolute; top: -120px; right: -60px;
//           width: 520px; height: 520px;
//           background: radial-gradient(circle, rgba(0,212,170,0.13) 0%, transparent 65%);
//           pointer-events: none;
//         }
//         .bg-glow-br {
//           position: absolute; bottom: -120px; left: -80px;
//           width: 480px; height: 480px;
//           background: radial-gradient(circle, rgba(0,212,170,0.07) 0%, transparent 65%);
//           pointer-events: none;
//         }

//         /* Noise texture overlay */
//         .noise-overlay {
//           position: absolute; inset: 0;
//           opacity: 0.025;
//           background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
//           background-size: 200px 200px;
//           pointer-events: none;
//         }

//         /* Card */
//         .card {
//           position: relative; z-index: 10;
//           max-width: 420px; width: 100%;
//           background: linear-gradient(145deg, rgba(19,36,36,0.95) 0%, rgba(11,24,24,0.98) 100%);
//           border: 1px solid rgba(0,212,170,0.12);
//           border-radius: 28px;
//           overflow: hidden;
//           box-shadow:
//             0 0 0 1px rgba(0,212,170,0.04),
//             0 24px 80px rgba(0,0,0,0.5),
//             0 8px 24px rgba(0,0,0,0.4),
//             inset 0 1px 0 rgba(255,255,255,0.04);
//           animation: card-enter 0.7s cubic-bezier(0.22,1,0.36,1) both;
//         }

//         @keyframes card-enter {
//           from { opacity: 0; transform: translateY(32px) scale(0.97); }
//           to   { opacity: 1; transform: translateY(0) scale(1); }
//         }

//         /* Top accent bar */
//         .card-accent {
//           height: 3px;
//           background: linear-gradient(90deg, transparent 0%, #00d4aa 40%, #00ffcc 60%, transparent 100%);
//           position: relative;
//         }
//         .card-accent::after {
//           content: '';
//           position: absolute;
//           inset: 0;
//           background: inherit;
//           filter: blur(6px);
//           opacity: 0.6;
//         }

//         /* Inner padding section */
//         .card-body {
//           padding: 44px 40px 36px;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           text-align: center;
//         }

//         /* Icon cluster */
//         .icon-cluster {
//           position: relative;
//           width: 100px;
//           height: 100px;
//           margin-bottom: 36px;
//           cursor: pointer;
//           animation: card-enter 0.9s 0.1s cubic-bezier(0.22,1,0.36,1) both;
//         }
//         .icon-orbit {
//           position: absolute; inset: -16px;
//           border-radius: 50%;
//           border: 1px dashed rgba(0,212,170,0.2);
//           animation: ring-spin 12s linear infinite;
//         }
//         .icon-orbit::before {
//           content: '';
//           position: absolute;
//           width: 6px; height: 6px;
//           background: #00d4aa;
//           border-radius: 50%;
//           top: -3px; left: 50%;
//           transform: translateX(-50%);
//           box-shadow: 0 0 8px #00d4aa;
//         }
//         .icon-main {
//           width: 100px; height: 100px;
//           background: linear-gradient(135deg, #1a3835 0%, #0f2828 100%);
//           border-radius: 28px;
//           border: 1px solid rgba(0,212,170,0.2);
//           display: flex; align-items: center; justify-content: center;
//           box-shadow:
//             0 0 0 8px rgba(0,212,170,0.04),
//             0 16px 40px rgba(0,0,0,0.4),
//             inset 0 1px 0 rgba(255,255,255,0.06);
//           transition: transform 0.3s ease, box-shadow 0.3s ease;
//           animation: icon-float 4s ease-in-out infinite;
//         }
//         @keyframes icon-float {
//           0%, 100% { transform: translateY(0px); }
//           50%       { transform: translateY(-6px); }
//         }
//         .icon-cluster:hover .icon-main {
//           transform: translateY(-4px);
//           box-shadow:
//             0 0 0 12px rgba(0,212,170,0.06),
//             0 24px 50px rgba(0,0,0,0.5),
//             inset 0 1px 0 rgba(255,255,255,0.08);
//         }
//         .icon-dot {
//           position: absolute;
//           width: 10px; height: 10px;
//           background: #00d4aa;
//           border-radius: 50%;
//           border: 2px solid #0e1a1a;
//           top: 2px; right: 2px;
//           box-shadow: 0 0 10px rgba(0,212,170,0.8);
//           animation: dot-blink 2s ease-in-out infinite;
//         }
//         @keyframes dot-blink {
//           0%, 100% { opacity: 1; transform: scale(1); }
//           50%       { opacity: 0.5; transform: scale(0.85); }
//         }

//         /* Typography */
//         .heading {
//           font-family: 'DM Serif Display', serif;
//           font-size: 32px;
//           font-weight: 400;
//           color: #ffffff;
//           line-height: 1.1;
//           margin-bottom: 14px;
//           letter-spacing: -0.5px;
//           animation: card-enter 0.8s 0.15s cubic-bezier(0.22,1,0.36,1) both;
//         }
//         .heading em {
//           font-style: italic;
//           color: #00d4aa;
//           position: relative;
//         }
//         .heading em::after {
//           content: '';
//           position: absolute;
//           bottom: -2px; left: 0; right: 0;
//           height: 1px;
//           background: linear-gradient(90deg, transparent, #00d4aa, transparent);
//           opacity: 0.5;
//         }

//         .subtext {
//           color: #7aa0a0;
//           font-size: 14px;
//           font-weight: 400;
//           line-height: 1.6;
//           margin-bottom: 20px;
//           animation: card-enter 0.8s 0.2s cubic-bezier(0.22,1,0.36,1) both;
//         }

//         /* Email chip */
//         .email-chip {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           background: rgba(0,212,170,0.04);
//           border: 1px solid rgba(0,212,170,0.15);
//           border-radius: 12px;
//           padding: 12px 18px;
//           margin-bottom: 32px;
//           width: 100%;
//           animation: card-enter 0.8s 0.25s cubic-bezier(0.22,1,0.36,1) both;
//         }
//         .email-chip-dot {
//           width: 8px; height: 8px;
//           border-radius: 50%;
//           background: #00d4aa;
//           flex-shrink: 0;
//           box-shadow: 0 0 6px rgba(0,212,170,0.6);
//         }
//         .email-chip-text {
//           color: #d0eded;
//           font-size: 14px;
//           font-weight: 500;
//           flex: 1;
//           text-align: left;
//           overflow: hidden;
//           text-overflow: ellipsis;
//           white-space: nowrap;
//         }

//         /* Primary button */
//         .btn-primary {
//           width: 100%;
//           padding: 15px;
//           background: linear-gradient(135deg, #00d4aa 0%, #00bfa0 100%);
//           color: #0a1f1f;
//           font-family: 'DM Sans', sans-serif;
//           font-size: 15px;
//           font-weight: 600;
//           border: none;
//           border-radius: 14px;
//           cursor: pointer;
//           letter-spacing: 0.2px;
//           position: relative;
//           overflow: hidden;
//           transition: transform 0.2s ease, box-shadow 0.2s ease;
//           box-shadow: 0 4px 20px rgba(0,212,170,0.35), inset 0 1px 0 rgba(255,255,255,0.2);
//           margin-bottom: 20px;
//           animation: card-enter 0.8s 0.3s cubic-bezier(0.22,1,0.36,1) both;
//           display: flex; align-items: center; justify-content: center; gap: 8px;
//         }
//         .btn-primary::before {
//           content: '';
//           position: absolute;
//           inset: 0;
//           background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
//           pointer-events: none;
//         }
//         .btn-primary:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 8px 28px rgba(0,212,170,0.45), inset 0 1px 0 rgba(255,255,255,0.2);
//         }
//         .btn-primary:active { transform: translateY(0); }

//         /* Resend row */
//         .resend-row {
//           font-size: 13px;
//           color: #4a7070;
//           animation: card-enter 0.8s 0.35s cubic-bezier(0.22,1,0.36,1) both;
//         }
//         .resend-btn {
//           background: none; border: none; cursor: pointer;
//           color: #00d4aa; font-size: 13px; font-family: inherit;
//           text-decoration: underline; text-underline-offset: 3px;
//           transition: color 0.2s ease;
//           padding: 0;
//         }
//         .resend-btn:hover { color: #ffffff; }
//         .resend-btn:disabled { color: #4a7070; cursor: default; text-decoration: none; }

//         .resend-pulse { animation: pulse-once 0.5s ease; }
//         @keyframes pulse-once {
//           0%, 100% { transform: scale(1); }
//           50% { transform: scale(1.04); }
//         }

//         /* Divider */
//         .divider {
//           width: 100%;
//           height: 1px;
//           background: linear-gradient(90deg, transparent, rgba(0,212,170,0.1), transparent);
//           margin: 28px 0 20px;
//           animation: card-enter 0.8s 0.4s cubic-bezier(0.22,1,0.36,1) both;
//         }

//         /* Tips row */
//         .tips-row {
//           display: flex;
//           gap: 8px;
//           margin-bottom: 28px;
//           width: 100%;
//           animation: card-enter 0.8s 0.38s cubic-bezier(0.22,1,0.36,1) both;
//         }
//         .tip-item {
//           flex: 1;
//           background: rgba(255,255,255,0.02);
//           border: 1px solid rgba(0,212,170,0.08);
//           border-radius: 10px;
//           padding: 10px 8px;
//           text-align: center;
//         }
//         .tip-icon { font-size: 16px; color: #00d4aa; margin-bottom: 4px; }
//         .tip-text { font-size: 11px; color: #5a8080; line-height: 1.4; }

//         /* Back link */
//         .back-link {
//           display: flex; align-items: center; gap: 6px;
//           color: #5a8080; text-decoration: none; font-size: 13px;
//           transition: color 0.2s ease;
//           animation: card-enter 0.8s 0.45s cubic-bezier(0.22,1,0.36,1) both;
//         }
//         .back-link:hover { color: #00d4aa; }
//         .material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal; line-height: 1; letter-spacing: normal; text-transform: none; display: inline-block; white-space: nowrap; word-wrap: normal; direction: ltr; }
//       `}</style>

//       <div className="page-root">
//         {/* Atmospheric rings */}
//         <div className="bg-ring bg-ring-1" />
//         <div className="bg-ring bg-ring-2" />
//         <div className="bg-ring bg-ring-3" />
//         <div className="bg-glow-tl" />
//         <div className="bg-glow-br" />
//         <div className="noise-overlay" />

//         <div className="card">
//           {/* Top accent */}
//           <div className="card-accent" />

//           <div className="card-body">
//             {/* Icon cluster */}
//             <div className="icon-cluster" onClick={openEmailApp} title="Open email app">
//               <div className="icon-orbit" />
//               <div className="icon-main">
//                 <span className="material-symbols-outlined" style={{ fontSize: "44px", color: "#00d4aa" }}>
//                   mark_email_unread
//                 </span>
//               </div>
//               <div className="icon-dot" />
//             </div>

//             {/* Heading */}
//             <h1 className="heading">
//               Verify your <em>inbox</em>
//             </h1>

//             <p className="subtext">
//               We've dispatched a secure verification link.<br />
//               Tap the icon above or use the button below.
//             </p>

//             {/* Email chip */}
//             <div className="email-chip">
//               <div className="email-chip-dot" />
//               <span className="email-chip-text">{email}</span>
//               <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#4a7070" }}>
//                 lock
//               </span>
//             </div>

//             {/* CTA */}
//             <button className={`btn-primary${pulse ? " resend-pulse" : ""}`} onClick={openEmailApp}>
//               <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>open_in_new</span>
//               Open Email App
//             </button>

//             {/* Tips */}
//             <div className="tips-row">
//               <div className="tip-item">
//                 <div className="tip-icon">
//                   <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>schedule</span>
//                 </div>
//                 <div className="tip-text">May take a few minutes</div>
//               </div>
//               <div className="tip-item">
//                 <div className="tip-icon">
//                   <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>folder</span>
//                 </div>
//                 <div className="tip-text">Check spam folder</div>
//               </div>
//               <div className="tip-item">
//                 <div className="tip-icon">
//                   <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>timer</span>
//                 </div>
//                 <div className="tip-text">Link expires in 24h</div>
//               </div>
//             </div>

//             {/* Resend */}
//             <div className="resend-row">
//               Didn't receive it?{" "}
//               <button
//                 className="resend-btn"
//                 onClick={handleResend}
//                 disabled={resendCooldown > 0}
//               >
//                 {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend email"}
//               </button>
//             </div>

//             <div className="divider" />

//             {/* Back */}
//             <Link to="/login" className="back-link">
//               <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>arrow_back</span>
//               Back to Login
//             </Link>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }


import { useLocation, Link } from "react-router";
import { useEffect, useState } from "react";

export default function CheckEmailPage() {
  const location = useLocation();
  const email = location.state?.email || "your email address";
  const [resendCooldown, setResendCooldown] = useState(0);
  const [sent, setSent] = useState(false);
  const [iconHovered, setIconHovered] = useState(false);

  useEffect(() => {
    if (resendCooldown > 0) {
      const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendCooldown]);

  const openEmailApp = () => {
    const emailLower = email.toLowerCase();
    if (emailLower.includes("@gmail.com")) {
      window.open("https://mail.google.com/", "_blank");
    } else if (emailLower.includes("@yahoo.com")) {
      window.open("https://mail.yahoo.com/", "_blank");
    } else if (
      emailLower.includes("@outlook.com") ||
      emailLower.includes("@hotmail.com")
    ) {
      window.open("https://outlook.live.com/", "_blank");
    } else {
      alert("Please open your email client to check for the verification link.");
    }
  };

  const handleResend = () => {
    setSent(true);
    setResendCooldown(30);
    setTimeout(() => setSent(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0b1616] flex items-center justify-center p-6 relative overflow-hidden">

      {/* Decorative rings */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[700px] h-[700px] rounded-full border border-[#00d4aa]/[0.06] animate-[spin_50s_linear_infinite]" />
      </div>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[520px] h-[520px] rounded-full border border-[#00d4aa]/[0.05] animate-[spinReverse_35s_linear_infinite]" />
      </div>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[350px] h-[350px] rounded-full border border-[#00d4aa]/[0.08] animate-[spin_22s_linear_infinite]" />
      </div>

      {/* Ambient glows */}
      <div className="pointer-events-none absolute -top-40 -right-20 w-[500px] h-[500px] rounded-full bg-[#00d4aa]/[0.09] blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-20 w-[420px] h-[420px] rounded-full bg-[#00d4aa]/[0.05] blur-[100px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] rounded-full bg-[#00d4aa]/[0.04] blur-[60px]" />

      {/* Card wrapper */}
      <div className="relative z-10 w-full max-w-[400px] animate-[fadeSlideUp_0.65s_cubic-bezier(0.22,1,0.36,1)_both]">

        {/* Card shell */}
        <div className="relative rounded-[28px] overflow-hidden
          bg-gradient-to-b from-[#132828]/95 to-[#0c1e1e]/98
          border border-[#00d4aa]/[0.13]
          shadow-[0_0_0_1px_rgba(0,212,170,0.04),0_32px_80px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.04)]">

          {/* Top neon accent bar */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#00d4aa] to-transparent opacity-80" />
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#00d4aa] to-transparent blur-[6px] opacity-40 -mt-[2px]" />

          {/* Body */}
          <div className="px-10 pt-10 pb-9 flex flex-col items-center text-center">

            {/* Icon cluster */}
            <div
              className="relative mb-9 cursor-pointer select-none"
              onClick={openEmailApp}
              onMouseEnter={() => setIconHovered(true)}
              onMouseLeave={() => setIconHovered(false)}
            >
              {/* Outer orbiting dashed ring */}
              <div className="absolute -inset-5 rounded-full border border-dashed border-[#00d4aa]/25 animate-[spin_14s_linear_infinite]">
                <div className="absolute -top-[3px] left-1/2 -translate-x-1/2 w-[7px] h-[7px] rounded-full bg-[#00d4aa] shadow-[0_0_8px_2px_rgba(0,212,170,0.7)]" />
              </div>

              {/* Mid ring */}
              <div className="absolute -inset-2 rounded-[22px] border border-[#00d4aa]/10" />

              {/* Icon box */}
              <div className={`relative w-24 h-24 rounded-[22px]
                bg-gradient-to-br from-[#1c3f3a] to-[#0e2a28]
                border border-[#00d4aa]/20
                flex items-center justify-center
                transition-all duration-300
                ${iconHovered
                  ? "shadow-[0_0_0_12px_rgba(0,212,170,0.07),0_20px_50px_rgba(0,0,0,0.55)] -translate-y-1"
                  : "shadow-[0_0_0_8px_rgba(0,212,170,0.04),0_16px_40px_rgba(0,0,0,0.45)] animate-[iconFloat_4s_ease-in-out_infinite]"
                }`}
              >
                <span className="material-symbols-outlined text-[#00d4aa] leading-none" style={{ fontSize: 44 }}>
                  mark_email_unread
                </span>
                <div className="absolute inset-0 rounded-[22px] bg-gradient-to-br from-white/[0.05] via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Status dot */}
              <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-[#00d4aa] border-2 border-[#0b1616] shadow-[0_0_8px_rgba(0,212,170,0.9)] animate-[dotPulse_2s_ease-in-out_infinite]" />
            </div>

            {/* Heading */}
            <h1 className="text-[28px] font-light tracking-tight text-white leading-tight mb-3 animate-[fadeSlideUp_0.7s_0.1s_cubic-bezier(0.22,1,0.36,1)_both]"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              Check your{" "}
              <span className="italic text-[#00d4aa] relative">
                inbox
                <span className="absolute -bottom-[1px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00d4aa]/60 to-transparent" />
              </span>
            </h1>

            <p className="text-[#6d9696] text-[13px] leading-relaxed mb-6 animate-[fadeSlideUp_0.7s_0.15s_cubic-bezier(0.22,1,0.36,1)_both]">
              We've sent a secure verification link.<br />
              Please check the address below.
            </p>

            {/* Email chip */}
            <div className="w-full flex items-center gap-3 bg-[#00d4aa]/[0.04] border border-[#00d4aa]/[0.14] rounded-xl px-4 py-3 mb-7 animate-[fadeSlideUp_0.7s_0.2s_cubic-bezier(0.22,1,0.36,1)_both]">
              <div className="w-2 h-2 rounded-full bg-[#00d4aa] flex-shrink-0 shadow-[0_0_6px_rgba(0,212,170,0.7)]" />
              <span className="flex-1 text-left text-[#c8e8e8] text-[13px] font-medium truncate">{email}</span>
              <span className="material-symbols-outlined text-[#3a6060] leading-none" style={{ fontSize: 15 }}>lock</span>
            </div>

            {/* CTA button */}
            <button
              onClick={openEmailApp}
              className="w-full flex items-center justify-center gap-2
                py-[14px] rounded-[13px] mb-5
                bg-gradient-to-br from-[#00d4aa] to-[#00b894]
                text-[#071a18] text-[14px] font-semibold tracking-wide
                relative overflow-hidden
                shadow-[0_4px_20px_rgba(0,212,170,0.35),inset_0_1px_0_rgba(255,255,255,0.2)]
                transition-all duration-200
                hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,212,170,0.45)]
                active:translate-y-0
                animate-[fadeSlideUp_0.7s_0.25s_cubic-bezier(0.22,1,0.36,1)_both]"
            >
              <span className="absolute inset-0 bg-gradient-to-b from-white/[0.12] to-transparent pointer-events-none" />
              <span className="material-symbols-outlined leading-none" style={{ fontSize: 17 }}>open_in_new</span>
              Open Email App
            </button>

            {/* Tip pills */}
            <div className="w-full grid grid-cols-3 gap-2 mb-6 animate-[fadeSlideUp_0.7s_0.3s_cubic-bezier(0.22,1,0.36,1)_both]">
              {[
                { icon: "schedule", label: "Takes a few minutes" },
                { icon: "folder_open", label: "Check spam folder" },
                { icon: "timer", label: "Expires in 24h" },
              ].map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1 py-[10px] px-2
                    bg-white/[0.02] border border-[#00d4aa]/[0.08] rounded-xl"
                >
                  <span className="material-symbols-outlined text-[#00d4aa] leading-none" style={{ fontSize: 15 }}>{icon}</span>
                  <span className="text-[10px] text-[#4a7272] leading-snug text-center">{label}</span>
                </div>
              ))}
            </div>

            {/* Resend */}
            <p className="text-[12px] text-[#3e6060] animate-[fadeSlideUp_0.7s_0.35s_cubic-bezier(0.22,1,0.36,1)_both]">
              Didn't receive it?{" "}
              {sent ? (
                <span className="text-[#00d4aa]">Sent ✓</span>
              ) : resendCooldown > 0 ? (
                <span className="text-[#3e6060]">Resend in {resendCooldown}s</span>
              ) : (
                <button
                  onClick={handleResend}
                  className="text-[#00d4aa] underline underline-offset-2 hover:text-white transition-colors duration-200 bg-transparent border-0 cursor-pointer p-0 text-[12px] font-[inherit]"
                >
                  Resend email
                </button>
              )}
            </p>

            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#00d4aa]/10 to-transparent my-7 animate-[fadeSlideUp_0.7s_0.4s_cubic-bezier(0.22,1,0.36,1)_both]" />

            {/* Back link */}
            <Link
              to="/login"
              className="flex items-center gap-[6px] text-[12px] text-[#3e6060] hover:text-[#00d4aa] transition-colors duration-200 no-underline animate-[fadeSlideUp_0.7s_0.45s_cubic-bezier(0.22,1,0.36,1)_both]"
            >
              <span className="material-symbols-outlined leading-none" style={{ fontSize: 14 }}>arrow_back</span>
              Back to Login
            </Link>

          </div>
        </div>

        {/* Card reflection glow */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-[#00d4aa]/[0.08] blur-2xl rounded-full pointer-events-none" />
      </div>

      {/* Font imports + keyframes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0');
        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined';
          font-weight: normal; font-style: normal;
          line-height: 1; letter-spacing: normal;
          text-transform: none; display: inline-block;
          white-space: nowrap; direction: ltr;
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes iconFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-7px); }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.78); }
        }
        @keyframes spinReverse {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
      `}</style>
    </div>
  );
}