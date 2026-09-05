"use client";

import Link from "next/link";
import { useState } from "react";
import { signUp, signIn } from "@/lib/auth-client";
import { Loader2, TriangleAlert, ArrowLeft, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

// UI Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

const SignUpCard = () => {
  const router = useRouter();

  // --- State Management ---
  const [step, setStep] = useState<"email" | "password">("email");

  // Loading States
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Form Data States
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI Toggles
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [validationError, setValidationError] = useState("");

  // --- Handlers ---

  const handleTabChange = (value: string) => {
    if (value === "signin") {
      setLoading(true);
      router.push("/login");
    }
  };

  const onProviderSignUp = async (provider: "google") => {
    try {
      setLoading(true);
      setLoadingGoogle(true);
      setValidationError("");

      const res = await signIn.social({
        provider,
        callbackURL: "/",
      });

      if (res?.error) {
        setValidationError(res.error.message || "Failed to sign up with Google");
        setLoading(false);
        setLoadingGoogle(false);
      }
    } catch (err: any) {
      setLoading(false);
      setLoadingGoogle(false);
      setValidationError(err?.message || "Failed to sign up with Google");
    }
  };

  const handleEmailContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError("Invalid email address");
      return;
    }
    setValidationError("");
    setStep("password");
  };

  const onCredentialSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError("");
    setIsPending(true);

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      setIsPending(false);
      return;
    }

    if (!firstName || !lastName) {
      setValidationError("Please enter your full name");
      setIsPending(false);
      return;
    }

    const fullName = `${firstName} ${lastName}`.trim();

    try {
      await signUp.email(
        {
          email,
          password,
          name: fullName,
        },
        {
          onSuccess: () => {
            window.location.href = "/";
          },
          onError: (ctx) => {
            setValidationError(ctx.error.message || "Failed to create account");
            setIsPending(false);
          },
        }
      );
    } catch (err: any) {
      setValidationError(err?.message || "Registration failed");
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#faf9f5] text-[#141413]">
      {/* Left Side - Brand & Editorial Mission */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#efe9de] flex-col justify-between p-12 fixed left-0 top-0 h-screen overflow-hidden z-10 border-r border-[#e6dfd8]">
        <div className="flex flex-col items-start justify-center flex-1 space-y-8 max-w-lg mx-auto">
          <Link href="/" className="flex items-center gap-2.5">
            <svg className="w-8 h-8 text-[#cc785c]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z" />
            </svg>
            <span className="font-serif text-2xl font-medium tracking-tight text-[#141413]">
              AuraScreening
            </span>
          </Link>

          <div className="space-y-4">
            <h1 className="font-serif text-4xl text-[#141413] tracking-tight font-normal leading-tight">
              Create your recruiter account.
            </h1>
            <p className="text-base text-[#3d3d3a] leading-relaxed font-sans">
              Start screening candidates autonomously with transparent AI scoring, skill verification, and bias-free rank ordering.
            </p>
          </div>

          <div className="pt-6 border-t border-[#e6dfd8] w-full flex items-center gap-2 text-xs font-mono text-[#6c6a64]">
            <ShieldCheck size={16} className="text-[#5db872]" />
            <span>SOC2 Type II & EEOC Compliant Infrastructure</span>
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="flex-1 lg:w-1/2 lg:ml-[50%] flex flex-col min-h-screen">
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md space-y-6">
            
            {/* Mobile Brand Link */}
            <Link href="/" className="lg:hidden flex items-center gap-2 justify-center mb-6">
              <svg className="w-6 h-6 text-[#cc785c]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z" />
              </svg>
              <span className="font-serif text-xl font-medium text-[#141413]">AuraScreening</span>
            </Link>

            <Card className="border border-[#e6dfd8] shadow-xs bg-[#faf9f5] rounded-xl">
              <CardHeader className="text-center pb-4 space-y-2">
                {/* Back Button for Password Step */}
                {step === "password" && (
                  <div className="flex justify-start mb-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStep("email")}
                      className="text-[#cc785c] hover:text-[#a9583e] hover:bg-[#efe9de] text-xs font-medium px-2 h-7"
                      disabled={loading || isPending}
                    >
                      <ArrowLeft size={14} className="mr-1" />
                      Back to email
                    </Button>
                  </div>
                )}

                <CardTitle className="font-serif text-2xl font-normal text-[#141413]">
                  {step === "email"
                    ? "Create an account"
                    : "Set up your credentials"}
                </CardTitle>
                <CardDescription className="text-sm text-[#6c6a64] font-sans">
                  {step === "email"
                    ? "Get started with autonomous candidate screening"
                    : "Enter your personal details and password"}
                </CardDescription>

                {/* Show email confirmation in password step */}
                {step === "password" && (
                  <div className="mt-2 p-2 bg-[#efe9de] rounded-md border border-[#e6dfd8] text-xs text-[#3d3d3a] text-center">
                    Signing up as <span className="font-semibold text-[#141413]">{email}</span>
                  </div>
                )}

                {/* Validation Alerts */}
                {!!validationError && (
                  <div className="mt-4 bg-[#c64545]/10 border border-[#c64545]/30 p-2.5 rounded-md flex items-center gap-x-2 text-xs text-[#c64545]">
                    <TriangleAlert className="size-4 shrink-0" />
                    <p>{validationError}</p>
                  </div>
                )}

                {/* Tabs */}
                <div className="flex justify-center w-full pt-2">
                  <Tabs
                    defaultValue="signup"
                    value="signup"
                    onValueChange={handleTabChange}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2 h-9 bg-[#efe9de] rounded-md p-1 border border-[#e6dfd8]">
                      <TabsTrigger
                        value="signin"
                        className="h-7 text-xs font-semibold text-[#6c6a64] data-[state=active]:bg-[#faf9f5] data-[state=active]:text-[#141413] rounded-sm"
                      >
                        Sign In
                      </TabsTrigger>
                      <TabsTrigger
                        value="signup"
                        className="h-7 text-xs font-semibold text-[#141413] data-[state=active]:bg-[#faf9f5] data-[state=active]:shadow-xs rounded-sm"
                      >
                        Create Account
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-0">
                {/* STEP 1: EMAIL & OAUTH */}
                {step === "email" && (
                  <>
                    {/* Google Button */}
                    <Button
                      variant="outline"
                      className="w-full h-10 text-sm font-medium border-[#e6dfd8] bg-[#faf9f5] text-[#141413] hover:bg-[#efe9de] cursor-pointer"
                      type="button"
                      onClick={() => onProviderSignUp("google")}
                      disabled={loading}
                    >
                      {loadingGoogle ? (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-2 h-4 w-4"
                          viewBox="0 0 16 16"
                        >
                          <g fill="none" fillRule="evenodd" clipRule="evenodd">
                            <path
                              fill="#f44336"
                              d="M7.209 1.061c.725-.081 1.154-.081 1.933 0a6.57 6.57 0 0 1 3.65 1.82a100 100 0 0 0-1.986 1.93q-1.876-1.59-4.188-.734q-1.696.78-2.362 2.528a78 78 0 0 1-2.148-1.658a.26.26 0 0 0-.16-.027q1.683-3.245 5.26-3.86"
                            />
                            <path
                              fill="#ffc107"
                              d="M1.946 4.92q.085-.013.161.027a78 78 0 0 0 2.148 1.658A7.6 7.6 0 0 0 4.04 7.99q.037.678.215 1.331L2 11.116Q.527 8.038 1.946 4.92"
                            />
                            <path
                              fill="#448aff"
                              d="M12.685 13.29a26 26 0 0 0-2.202-1.74q1.15-.812 1.396-2.228H8.122V6.713q3.25-.027 6.497.055q.616 3.345-1.423 6.032a7 7 0 0 1-.51.49"
                            />
                            <path
                              fill="#43a047"
                              d="M4.255 9.322q1.23 3.057 4.51 2.854a3.94 3.94 0 0 0 1.718-.626q1.148.812 2.202 1.74a6.62 6.62 0 0 1-4.027 1.684a6.4 6.4 0 0 1-1.02 0Q3.82 14.524 2 11.116z"
                            />
                          </g>
                        </svg>
                      )}
                      Continue with Google
                    </Button>

                    {/* Divider */}
                    <div className="relative text-center text-xs py-1">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[#e6dfd8]" />
                      </div>
                      <div className="relative flex justify-center text-[11px] uppercase tracking-wider font-mono">
                        <span className="bg-[#faf9f5] px-2 text-[#6c6a64]">
                          Or continue with email
                        </span>
                      </div>
                    </div>

                    {/* Email Input Form */}
                    <form onSubmit={handleEmailContinue} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="signup-email"
                          className="text-xs font-semibold text-[#141413]"
                        >
                          Email Address
                        </Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="name@company.com"
                          className="h-10 text-sm bg-[#faf9f5] border-[#e6dfd8] text-[#141413] focus:border-[#cc785c]"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={loading}
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full h-10 text-sm font-semibold bg-[#cc785c] text-white hover:bg-[#a9583e] cursor-pointer"
                        disabled={!email || loading}
                      >
                        Continue with Email
                      </Button>
                    </form>
                  </>
                )}

                {/* STEP 2: PASSWORD & DETAILS */}
                {step === "password" && (
                  <form onSubmit={onCredentialSignUp} className="space-y-4">
                    {/* Personal Info */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="firstName"
                            className="text-xs font-semibold text-[#141413]"
                          >
                            First Name
                          </Label>
                          <Input
                            id="firstName"
                            placeholder="Alex"
                            className="h-10 text-sm bg-[#faf9f5] border-[#e6dfd8] text-[#141413] focus:border-[#cc785c]"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            disabled={isPending}
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="lastName"
                            className="text-xs font-semibold text-[#141413]"
                          >
                            Last Name
                          </Label>
                          <Input
                            id="lastName"
                            placeholder="Rivera"
                            className="h-10 text-sm bg-[#faf9f5] border-[#e6dfd8] text-[#141413] focus:border-[#cc785c]"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            disabled={isPending}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Password Section */}
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="password"
                          className="text-xs font-semibold text-[#141413]"
                        >
                          Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPw ? "text" : "password"}
                            placeholder="Create a strong password"
                            className="h-10 text-sm pr-10 bg-[#faf9f5] border-[#e6dfd8] text-[#141413] focus:border-[#cc785c]"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isPending}
                            required
                            minLength={3}
                            maxLength={20}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPw((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6c6a64] hover:text-[#141413]"
                            tabIndex={-1}
                          >
                            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label
                          htmlFor="confirm"
                          className="text-xs font-semibold text-[#141413]"
                        >
                          Confirm Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirm"
                            type={showPw2 ? "text" : "password"}
                            placeholder="Confirm password"
                            className="h-10 text-sm pr-10 bg-[#faf9f5] border-[#e6dfd8] text-[#141413] focus:border-[#cc785c]"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={isPending}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPw2((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6c6a64] hover:text-[#141413]"
                            tabIndex={-1}
                          >
                            {showPw2 ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        className="w-full h-10 text-sm font-semibold bg-[#cc785c] text-white hover:bg-[#a9583e] cursor-pointer"
                        disabled={loading || isPending}
                      >
                        {isPending || loading ? (
                          <>
                            <Loader2 className="mr-2 size-4 animate-spin" />
                            Creating Account...
                          </>
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Terms Footer */}
            <div className="text-center text-xs text-[#6c6a64]">
              <p className="text-balance">
                By creating an account, you agree to our{" "}
                <Link
                  href="/terms"
                  className="font-medium text-[#cc785c] hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  className="font-medium text-[#cc785c] hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpCard;

