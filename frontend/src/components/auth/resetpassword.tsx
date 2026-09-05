"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Loader2, TriangleAlert, Check, ArrowLeft, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { updatePassword } from "@/actions/reset-password";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

export function ResetPasswordCard() {
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? undefined;

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) return setError("Invalid or missing token.");
    if (password !== confirm) return setError("Passwords do not match.");

    setIsPending(true);
    try {
      const formData = new FormData();
      formData.append("token", token);
      formData.append("password", password);

      const res = await updatePassword(formData);

      if (res.error) setError(res.error);
      if (res.success) setSuccess(res.success);
    } catch {
      setError("Something went wrong.");
    } finally {
      setIsPending(false);
    }
  };

  if (!token) {
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
                Secure password reset.
              </h1>
              <p className="text-base text-[#3d3d3a] leading-relaxed font-sans">
                Set a strong new password to protect your candidate screening data and recruiter workspace.
              </p>
            </div>

            <div className="pt-6 border-t border-[#e6dfd8] w-full flex items-center gap-2 text-xs font-mono text-[#6c6a64]">
              <ShieldCheck size={16} className="text-[#5db872]" />
              <span>SOC2 Type II & EEOC Compliant Infrastructure</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
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
                    Invalid Reset Link
                  </CardTitle>
                  <CardDescription className="text-sm text-[#6c6a64] font-sans">
                    The token is missing or has expired.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="text-center pt-2">
                    <Link
                      href="/forgot-password"
                      className="text-xs text-[#cc785c] hover:underline font-medium"
                    >
                      Request New Reset Link
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              Set your new password.
            </h1>
            <p className="text-base text-[#3d3d3a] leading-relaxed font-sans">
              Enter your new credentials below to update your password and access your workspace.
            </p>
          </div>

          <div className="pt-6 border-t border-[#e6dfd8] w-full flex items-center gap-2 text-xs font-mono text-[#6c6a64]">
            <ShieldCheck size={16} className="text-[#5db872]" />
            <span>SOC2 Type II & EEOC Compliant Infrastructure</span>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
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
                  Reset Your Password
                </CardTitle>
                <CardDescription className="text-sm text-[#6c6a64] font-sans">
                  Enter your new password to complete the update.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Success Message */}
                {success && (
                  <div
                    className="rounded-md border border-[#5db872]/40 bg-[#5db872]/10 px-4 py-2.5 text-xs font-medium text-[#5db872] flex items-center gap-2"
                    role="status"
                  >
                    <Check className="w-4 h-4 shrink-0" />
                    <p>{success}</p>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="bg-[#c64545]/10 border border-[#c64545]/30 p-2.5 rounded-md flex items-center gap-x-2 text-xs text-[#c64545]">
                    <TriangleAlert className="size-4 shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="password"
                      className="text-xs font-semibold text-[#141413]"
                    >
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPw ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="h-10 text-sm pr-10 bg-[#faf9f5] border-[#e6dfd8] text-[#141413] focus:border-[#cc785c]"
                        disabled={isPending}
                        required
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
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="••••••••"
                        className="h-10 text-sm pr-10 bg-[#faf9f5] border-[#e6dfd8] text-[#141413] focus:border-[#cc785c]"
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

                  <Button
                    type="submit"
                    className="w-full h-10 text-sm font-semibold bg-[#cc785c] text-white hover:bg-[#a9583e] cursor-pointer"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Resetting password...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>

                  <div className="text-center pt-2">
                    <Link
                      href="/login"
                      className="text-xs text-[#cc785c] hover:underline inline-flex items-center font-medium"
                    >
                      <ArrowLeft className="mr-1.5 w-3.5 h-3.5" />
                      Back to Sign In
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

