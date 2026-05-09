import { useEffect, useState } from "react";
import { gql } from "@apollo/client";
import { useNavigate, useSearchParams } from "react-router";
import { useMutation } from "@apollo/client/react";

const VERIFY_EMAIL = gql`
  mutation verifyEmail($token: String!) {
    verifyEmail(token: $token) {
      message
      success
    }
  }
`;

// Define what the GraphQL server returns
interface VerifyEmailResponse {
  verifyEmail: {
    success: boolean;
    message: string;
  };
}

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // State to track the verification process: 'loading' | 'success' | 'error'
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const token = searchParams.get("token");

  // Initialize mutation
  const [verifyEmailMutation] = useMutation<VerifyEmailResponse>(VERIFY_EMAIL);

  useEffect(() => {
    if (!token) {
      setVerificationStatus("error");
      setErrorMessage("Invalid verification link. No token provided.");
      return;
    }

    const verifyToken = async () => {
      try {
        const { data } = await verifyEmailMutation({
          variables: {
            token,
          },
        });

        if (data?.verifyEmail.success) {
          setVerificationStatus("success");
          setTimeout(() => {
            navigate("/login", { replace: true });
          }, 2000);
        } else {
          setVerificationStatus("error");
          setErrorMessage(data?.verifyEmail?.message || "Verification failed.");
        }
      } catch (error: any) {
        setVerificationStatus("error");
        setErrorMessage(
          error.message || "An unexpected server error occurred.",
        );
      }
    };

    verifyToken();
  }, [token, navigate, verifyEmailMutation]);

  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center p-6 md:p-12 font-body text-on-surface relative overflow-hidden">
      {/* Background ambient glow */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full blur-[100px] pointer-events-none transition-colors duration-1000 ${
          verificationStatus === "success"
            ? "bg-primary/10"
            : verificationStatus === "error"
              ? "bg-red-500/10"
              : "bg-primary/5"
        }`}
      ></div>

      <main className="w-full max-w-[400px] text-center relative z-10 flex flex-col items-center">
        {/* State 1: LOADING */}
        {verificationStatus === "loading" && (
          <div className="flex flex-col items-center animate-fade-in">
            {/* Custom Spinner */}
            <div className="relative w-20 h-20 mb-8">
              <div className="absolute inset-0 rounded-full border-[3px] border-outline-variant/30"></div>
              <div className="absolute inset-0 rounded-full border-[3px] border-primary border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                <div className="w-3 h-3 bg-primary rounded-full blur-[2px]"></div>
              </div>
            </div>
            <h1 className="font-headline text-2xl md:text-3xl font-bold text-on-surface mb-3">
              Verifying your email...
            </h1>
            <p className="text-on-surface-variant text-base">
              Please wait a moment while we confirm your details.
            </p>
          </div>
        )}

        {/* State 2: SUCCESS */}
        {verificationStatus === "success" && (
          <div className="flex flex-col items-center animate-fade-in">
            <div className="w-20 h-20 mb-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30 relative">
              <div
                className="absolute inset-0 rounded-full bg-primary/20 animate-ping"
                style={{ animationDuration: "2s" }}
              ></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-primary z-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="font-headline text-2xl md:text-3xl font-bold text-on-surface mb-3">
              Email Verified!
            </h1>
            <p className="text-on-surface-variant text-base">
              Redirecting you to the login page...
            </p>
          </div>
        )}

        {/* State 3: ERROR */}
        {verificationStatus === "error" && (
          <div className="flex flex-col items-center animate-fade-in">
            <div className="w-20 h-20 mb-8 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="font-headline text-2xl md:text-3xl font-bold text-on-surface mb-3">
              Verification Failed
            </h1>
            <p className="text-on-surface-variant text-base mb-8">
              {errorMessage}
            </p>
            <button
              onClick={() => navigate("/register")}
              className="w-full bg-surface-container-highest text-on-surface font-headline font-semibold py-3 px-6 rounded-xl border border-outline-variant hover:bg-surface-bright hover:text-white transition-colors"
            >
              Back to Sign Up
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
