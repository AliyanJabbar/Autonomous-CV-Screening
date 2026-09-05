"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2, ArrowLeft, MailCheck, TriangleAlert, ShieldCheck } from "lucide-react";
import { resetPassword } from "@/actions/forgot-password";

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
import { Label } from "@/components/ui/label";

export const ForgotPasswordCard = () => {
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsPending(true);

    const formData = new FormData();
    formData.append("email", email);

    try {
      const data = await resetPassword(formData);
      if (data?.error) {
        setError(data.error);
      } else if (data?.success) {
        setSuccess(data.success);
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
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
              Reset your workspace password.
            </h1>
            <p className="text-base text-[#3d3d3a] leading-relaxed font-sans">
              Don&apos;t worry, we&apos;ll help you securely regain access to your AuraScreening candidate evaluation workspace.
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
                  Forgot Password?
                </CardTitle>
                <CardDescription className="text-sm text-[#6c6a64] font-sans">
                  Enter your email address and we&apos;ll send you a recovery link.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Success Message */}
                {success && (
                  <div
                    className="rounded-md border border-[#5db872]/40 bg-[#5db872]/10 px-4 py-2.5 text-xs font-medium text-[#5db872] flex items-center gap-2"
                    role="status"
                  >
                    <MailCheck className="w-4 h-4 shrink-0" />
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
                      htmlFor="email"
                      className="text-xs font-semibold text-[#141413]"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="h-10 text-sm bg-[#faf9f5] border-[#e6dfd8] text-[#141413] focus:border-[#cc785c]"
                      disabled={isPending}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-10 text-sm font-semibold bg-[#cc785c] text-white hover:bg-[#a9583e] cursor-pointer"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Sending reset link...
                      </>
                    ) : (
                      "Send Reset Link"
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
};

