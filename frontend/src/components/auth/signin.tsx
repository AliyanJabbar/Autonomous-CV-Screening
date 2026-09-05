"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { signIn } from "@/lib/auth-client";
import { Loader2, TriangleAlert, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

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

const SignIn = () => {
  const router = useRouter();
  const params = useSearchParams();

  // State variables
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  // Local Error State
  const [errorState, setErrorState] = useState("");
  const [createdMsg, setCreatedMsg] = useState(params.get("created"));

  useEffect(() => {
    const urlError = params.get("error");
    if (urlError) {
      setErrorState(
        urlError === "CredentialsSignin"
          ? "Invalid email or password"
          : urlError
      );
    }
  }, [params]);

  // 1. Handle Credential Login (Email/Pass)
  const onCredentialSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorState("");
    setCreatedMsg(null);
    setLoading(true);
    setLoadingLogin(true);

    try {
      await signIn.email(
        {
          email,
          password,
        },
        {
          onSuccess: () => {
            router.push("/");
            router.refresh();
          },
          onError: (ctx) => {
            setLoading(false);
            setLoadingLogin(false);
            setErrorState(ctx.error.message || "Invalid email or password");
          },
        }
      );
    } catch (err: any) {
      setLoading(false);
      setLoadingLogin(false);
      setErrorState(err?.message || "Failed to sign in");
    }
  };

  // 2. Handle Google Login
  const onProviderSignIn = async (provider: "google") => {
    setLoading(true);
    setLoadingGoogle(true);

    await signIn.social({
      provider,
      callbackURL: "/",
    });
  };

  const handleTabChange = (value: string) => {
    if (value === "signup") {
      setLoading(true);
      router.push("/register");
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
              Sign in to your talent evaluation workspace.
            </h1>
            <p className="text-base text-[#3d3d3a] leading-relaxed font-sans">
              Access your autonomous candidate shortlists, semantic matching criteria, and bias-free evaluation reports.
            </p>
          </div>

          <div className="pt-6 border-t border-[#e6dfd8] w-full flex items-center gap-2 text-xs font-mono text-[#6c6a64]">
            <ShieldCheck size={16} className="text-[#5db872]" />
            <span>SOC2 Type II & EEOC Compliant Infrastructure</span>
          </div>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
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
                <CardTitle className="font-serif text-2xl font-normal text-[#141413]">
                  Welcome back
                </CardTitle>
                <CardDescription className="text-sm text-[#6c6a64] font-sans">
                  Sign in to continue to your candidate dashboard
                </CardDescription>

                {/* Tabs */}
                <div className="flex justify-center w-full pt-2">
                  <Tabs
                    defaultValue="signin"
                    value="signin"
                    onValueChange={handleTabChange}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2 h-9 bg-[#efe9de] rounded-md p-1 border border-[#e6dfd8]">
                      <TabsTrigger
                        value="signin"
                        className="h-7 text-xs font-semibold text-[#141413] data-[state=active]:bg-[#faf9f5] data-[state=active]:shadow-xs rounded-sm"
                      >
                        Sign In
                      </TabsTrigger>
                      <TabsTrigger
                        value="signup"
                        className="h-7 text-xs font-semibold text-[#6c6a64] data-[state=active]:bg-[#faf9f5] data-[state=active]:text-[#141413] rounded-sm"
                      >
                        Create Account
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Alerts/Errors */}
                {createdMsg && (
                  <div
                    className="mt-4 rounded-md border border-[#5db872]/40 bg-[#5db872]/10 px-4 py-2.5 text-xs font-medium text-[#5db872]"
                    role="status"
                  >
                    Account created successfully. Please sign in below.
                  </div>
                )}
                {!!errorState && (
                  <div className="mt-4 bg-[#c64545]/10 border border-[#c64545]/30 p-2.5 rounded-md flex items-center gap-x-2 text-xs text-[#c64545]">
                    <TriangleAlert className="size-4 shrink-0" />
                    <p>{errorState}</p>
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-4 pt-0">
                {/* Google Button */}
                <Button
                  variant="outline"
                  className="w-full h-10 text-sm font-medium border-[#e6dfd8] bg-[#faf9f5] text-[#141413] hover:bg-[#efe9de] cursor-pointer"
                  type="button"
                  onClick={() => onProviderSignIn("google")}
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
                      Or credentials
                    </span>
                  </div>
                </div>

                {/* Credentials Form */}
                <form onSubmit={onCredentialSignIn} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold text-[#141413]">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      type="email"
                      disabled={loading}
                      className="h-10 text-sm bg-[#faf9f5] border-[#e6dfd8] text-[#141413] focus:border-[#cc785c]"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-xs font-semibold text-[#141413]">
                        Password
                      </Label>
                      <Link
                        href="/forgot-password"
                        className="text-xs text-[#cc785c] hover:underline"
                      >
                        Forgot?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        type={showPw ? "text" : "password"}
                        disabled={loading}
                        className="h-10 text-sm pr-10 bg-[#faf9f5] border-[#e6dfd8] text-[#141413] focus:border-[#cc785c]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6c6a64] hover:text-[#141413]"
                        disabled={loading}
                      >
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-10 text-sm font-semibold bg-[#cc785c] text-white hover:bg-[#a9583e] cursor-pointer"
                    disabled={loading}
                  >
                    {loadingLogin ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

