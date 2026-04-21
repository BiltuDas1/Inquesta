import { useLocation } from "react-router";

export default function VerifyEmail() {
  const location = useLocation();

  const email = location.state?.email || "Your email address";
  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center p-6 md:p-12 font-body text-on-surface selection:bg-primary/30 relative overflow-hidden">
      {/* Large decorative ambient background glow for the whole page */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none"></div>

      {/* Main Content Wrapper - No card styling, just a max-width to keep lines readable */}
      <main className="w-full max-w-[800px] text-center relative z-10 flex flex-col items-center">
        {/* Floating Icon */}
        <div className="animate-float mb-10 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-surface-container-highest/50 flex items-center justify-center border border-outline-variant/50 relative">
            {/* Outer subtle pulse */}
            <div
              className="absolute inset-0 rounded-full bg-primary/10 animate-ping"
              style={{ animationDuration: "3s" }}
            ></div>

            {/* Mail Icon (SVG) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-primary z-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
          </div>
        </div>

        {/* Typography & Content */}
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-on-surface mb-6 tracking-tight">
          Check your inbox
        </h1>

        <p className="text-on-surface-variant text-lg md:text-xl mb-8 leading-relaxed">
          You're almost there! We sent an email to
          <br className="hidden sm:block" />
          <span className="font-semibold text-primary block sm:inline mt-2 sm:mt-0">
            {email}
          </span>
        </p>

        <p className="text-on-surface-variant text-base mb-10 leading-relaxed max-w-[420px]">
          Just click on the link in that email to complete your registration. If
          you don't see it, you may need to{" "}
          <strong className="text-on-surface font-semibold">
            check your spam folder.
          </strong>
        </p>

        {/* <div className="h-px w-full max-w-[320px] bg-outline-variant/40 mb-10"></div> */}

        {/* <p className="text-on-surface-variant text-sm mb-6">
          Still can't find the email? No problem.
        </p> */}

        {/* CTA Button */}
        {/* <button className="w-full max-w-[400px] bg-surface-container-highest text-on-surface font-headline font-semibold py-4 px-6 rounded-xl border border-outline-variant hover:bg-surface-bright hover:text-primary glow-hover focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors">
          Resend Verification Email
        </button> */}
      </main>
    </div>
  );
}
