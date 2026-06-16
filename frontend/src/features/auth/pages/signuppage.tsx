import { useState } from "react";
import { gql } from "@apollo/client";
import toast from "react-hot-toast";
import { useMutation } from "@apollo/client/react";
import { useNavigate, Link } from "react-router"; // Added Link import
import { google_login } from "../utils/googleauth";
import GoogleSVG from "../../../shared/svg/google";
import InputField from "../../../shared/components/inputfield";

// Define what the GraphQL server returns
interface RegisterResponse {
  register: {
    success: boolean;
    message: string;
  };
}

// UPDATE 1: Added $is_student to the GraphQL mutation
const REGISTER_MUTATION = gql`
  mutation register(
    $email: String!
    $firstname: String!
    $lastname: String!
    $password: String!
    $is_student: Boolean!
  ) {
    register(
      email: $email
      firstname: $firstname
      lastname: $lastname
      password: $password
      is_student: $is_student
    ) {
      message
      success
    }
  }
`;

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  // UPDATE 2: Added is_student to formData state (defaulting to true)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    is_student: true,
  });

  // Initalize apollo mutation
  const [registerUser, { loading }] =
    useMutation<RegisterResponse>(REGISTER_MUTATION);

  // Handle input change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  // Send the data into backend server
  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Basic validation
    if (
      !formData.email ||
      !formData.password ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.confirmPassword
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    // check password and confirm password both are same or not
    if (formData.password !== formData.confirmPassword) {
      toast.error("Password and confirm password do not match");
      return;
    }

    try {
      // UPDATE 3: Pass is_student in the variables payload
      const { data } = await registerUser({
        variables: {
          email: formData.email,
          firstname: formData.firstName,
          lastname: formData.lastName,
          password: formData.password,
          is_student: formData.is_student,
        },
      });

      // Handled backend response
      if (data?.register.success) {
        toast.success(
          data?.register.message ||
            "Account created successfully! Check your email",
        );

        // Navigate to the new page AND pass the email in state
        navigate("/check-email", { state: { email: formData.email } });

        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          is_student: true,
        });
      } else {
        toast.error(
          data?.register?.message || "Registration failed. Please try again.",
        );
      }
    } catch (error: any) {
      console.error("GraphQL Error:", error);
      toast.error(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0e1a1a] font-headline">
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
              <img className="h-8" src="/favicon.svg" />
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
            Join thousands of learners on Inquesta
          </p>

          {/* Social buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              className="flex-1 flex items-center justify-center gap-2  cursor-pointer bg-[#1b2e2e] hover:bg-[#1f3535] border border-[#2a4040] text-white text-sm font-medium py-3 px-4 rounded-xl transition-colors duration-200"
              onClick={google_login}
            >
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

          <form onSubmit={handleSave}>

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
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
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
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
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
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <InputField
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                name="password"
                value={formData.password}
                onChange={handleChange}
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
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
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
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-xl text-sm transition-colors duration-200 tracking-wide mb-5 
                ${loading ? "bg-[#4a7070] cursor-not-allowed opacity-80" : "bg-[#00d4aa] hover:bg-[#00bfa0] active:bg-[#00a88c] cursor-pointer"}`}
            >
              {loading && (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
          {/* Login link */}
          <p className="text-center text-[#4a7070] text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#00d4aa] hover:text-[#00bfa0] font-medium transition-colors"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
