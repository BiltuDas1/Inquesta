import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

// GraphQL mutation
const LOGIN_WITH_GOOGLE = gql`
  mutation loginWithGoogle($code: String!) {
    loginWithGoogle(code: $code) {
      data {
        role
      }
      message
      success
    }
  }
`;
export default function GoogleLogin() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [loginWithGoogle, { loading, error: apolloError }] = useMutation(
    LOGIN_WITH_GOOGLE,
    {
      onCompleted: (data: any) => {
        if (data.loginWithGoogle.success) {
          const userRole = data.loginWithGoogle.data?.role;

          // Route based on role
          if (userRole === "admin") {
            navigate("/dashboard");
          } else {
            navigate("/courses");
          }
        }
        // Capture the specific GraphQL validation message (e.g., "Token expired")
        else {
          setErrorMessage(data.loginWithGoogle.message);
        }
      },
      onError: (err) => {
        setErrorMessage(err.message);
      },
    },
  );

  useEffect(() => {
    if (code) {
      loginWithGoogle({ variables: { code } });
    }
  }, [code, loginWithGoogle]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-background font-body">
        {/* Themed SVG Spinner */}
        <svg className="w-14 h-14 animate-spin" viewBox="0 0 50 50">
          <circle
            className="stroke-surface-container-highest"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="4"
          />

          <circle
            className="stroke-primary"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="4"
            strokeDasharray="30 100"
            strokeLinecap="round"
          />
        </svg>

        <h2 className="mt-6 text-xl font-headline text-on-surface">
          Authenticating...
        </h2>
        <p className="mt-2 text-on-surface-variant">
          Please wait while we log you securely in.
        </p>
      </div>
    );
  }

  if (errorMessage || apolloError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen font-sans bg-white px-4 text-center">
        <h1 className="text-2xl font-bold text-red-500">
          Authentication Error
        </h1>
        <p className="mt-2 text-gray-600">
          Something went wrong. Please try logging in again:
          {errorMessage || apolloError?.message}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-sans bg-white px-4 text-center">
      <h1 className="text-2xl font-bold text-gray-800">Auth Callback</h1>
      <p className="mt-2 text-gray-500">Processing code...</p>
    </div>
  );
}
