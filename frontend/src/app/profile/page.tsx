"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useSession } from "@/lib/auth-client";
import {
  User,
  Zap,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  FileCheck2,
  Clock,
  CheckCircle2,
  Loader2,
  AlertCircle,
  CreditCard,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileUsageData {
  user_id: string | null;
  plan: string;
  plan_name: string;
  status: string;
  total_credits: number;
  credits_used: number;
  credits_remaining: number;
  interval: string;
  current_period_end: string | null;
}

const PLAN_FEATURES: Record<string, string[]> = {
  starter: [
    "10 CV evaluations / month",
    "Standard criteria matching engine",
    "Demographic bias shield",
    "Instant PDF & CSV export",
  ],
  pro: [
    "100 CV evaluations / month",
    "Multiple CV evaluation in a single run",
    "Real-time AI decision audit logs",
    "Priority batch processing queue",
    "Greenhouse & Lever ATS connectors",
  ],
  "pro-max": [
    "1,000 CV evaluations / month",
    "Custom LLM fine-tuning on company taxonomy",
    "Dedicated SOC2 & GDPR compliance shield",
    "SLA guaranteed inference latency",
    "Dedicated HR solutions architect",
  ],
};

function ProfileContent() {
  const { data: sessionData, isPending: isAuthPending } = useSession();
  const user = sessionData?.user;

  const [usage, setUsage] = useState<ProfileUsageData | null>(null);
  const [loadingUsage, setLoadingUsage] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsage = async () => {
    try {
      setLoadingUsage(true);
      setError(null);

      const backendUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "http://localhost:8000";

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      const userToken = sessionData?.session?.token;
      if (userToken) {
        headers["Authorization"] = `Bearer ${userToken}`;
      }

      const queryParam = user?.id ? `?user_id=${encodeURIComponent(user.id)}` : "";
      const res = await fetch(`${backendUrl}/payments/profile-usage${queryParam}`, {
        headers,
      });

      if (!res.ok) {
        throw new Error(`Failed to load profile usage (status: ${res.status})`);
      }

      const data: ProfileUsageData = await res.json();
      setUsage(data);
    } catch (err: any) {
      console.error("Error loading profile credits:", err);
      setError(err?.message || "Could not retrieve credit information.");
    } finally {
      setLoadingUsage(false);
    }
  };

  useEffect(() => {
    if (!isAuthPending) {
      fetchUsage();
    }
  }, [user?.id, isAuthPending]);

  const handleUpgradeCheckout = async (targetPlan: string) => {
    try {
      setIsUpgrading(true);
      const backendUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "http://localhost:8000";

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      const userToken = sessionData?.session?.token;
      if (userToken) {
        headers["Authorization"] = `Bearer ${userToken}`;
      }

      const res = await fetch(`${backendUrl}/payments/create-checkout-session`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          plan: targetPlan,
          interval: "month",
          user_id: user?.id || undefined,
          user_email: user?.email || undefined,
          ui_mode: "hosted",
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Unable to initiate Stripe checkout.");
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      alert(err.message || "Failed to launch Stripe checkout");
      setIsUpgrading(false);
    }
  };

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) return name.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return "U";
  };

  if (isAuthPending) {
    return (
      <div className="min-h-screen bg-[#faf9f5] flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-[#6c6a64]">
          <Loader2 className="animate-spin text-[#cc785c]" size={20} />
          <span>Loading user profile...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#faf9f5] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white border border-[#e6dfd8] rounded-3xl p-8 sm:p-10 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-[#efe9de] text-[#141413] mx-auto flex items-center justify-center mb-5">
            <User size={28} />
          </div>
          <h2 className="font-serif text-2xl text-[#141413]">Account Required</h2>
          <p className="text-xs text-[#6c6a64] mt-2 mb-6">
            Please log in or create an account to view your profile and evaluate candidate CVs.
          </p>
          <div className="flex flex-col gap-2.5">
            <Link
              href="/login"
              className="w-full py-3 rounded-xl bg-[#cc785c] text-white text-xs font-semibold hover:bg-[#a9583e] transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="w-full py-3 rounded-xl bg-[#efe9de] text-[#141413] text-xs font-medium hover:bg-[#e8e0d2] transition-colors border border-[#e6dfd8]"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const normalizedPlan = (usage?.plan || "starter").toLowerCase();
  const totalCredits = usage?.total_credits ?? 10;
  const usedCredits = usage?.credits_used ?? 0;
  const remainingCredits = usage?.credits_remaining ?? 10;
  const usagePercentage = Math.min(
    100,
    Math.round((usedCredits / (totalCredits || 1)) * 100)
  );

  const isPro = normalizedPlan.includes("pro");
  const isProMax = normalizedPlan.includes("max");
  const planFeatures =
    PLAN_FEATURES[normalizedPlan] ||
    (isProMax ? PLAN_FEATURES["pro-max"] : isPro ? PLAN_FEATURES["pro"] : PLAN_FEATURES["starter"]);

  return (
    <div className="min-h-screen bg-[#faf9f5] text-[#141413] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/screening"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#6c6a64] hover:text-[#141413] transition-colors"
          >
            <ArrowLeft size={14} />
            Back to CV Screening Portal
          </Link>

          <button
            onClick={fetchUsage}
            disabled={loadingUsage}
            className="inline-flex items-center gap-1.5 text-xs text-[#6c6a64] hover:text-[#141413] transition-colors"
          >
            <RefreshCw size={13} className={loadingUsage ? "animate-spin" : ""} />
            <span>Refresh Status</span>
          </button>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white border border-[#e6dfd8] rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <Avatar className="h-16 w-16 border-2 border-[#e6dfd8]">
                <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                <AvatarFallback className="bg-[#cc785c] text-white font-serif text-2xl font-medium">
                  {getInitials(user.name, user.email)}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#141413]">
                    {user.name || "Recruitment Specialist"}
                  </h1>
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium px-2 py-0.5 rounded-full">
                    <ShieldCheck size={12} />
                    Verified
                  </span>
                </div>
                <p className="text-xs text-[#6c6a64] font-mono">{user.email}</p>
              </div>
            </div>

            <Link
              href="/screening"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#141413] text-white hover:bg-[#252320] text-xs font-medium transition-all shadow-xs"
            >
              <FileCheck2 size={15} />
              <span>Launch Screening Engine</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Credits & Subscription Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Runs & Credits Card (Left Column) */}
          <div className="lg:col-span-7 bg-white border border-[#e6dfd8] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#e6dfd8] pb-5">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#cc785c] font-semibold">
                  Usage & Capacity
                </span>
                <h2 className="font-serif text-2xl text-[#141413] mt-1 font-normal">
                  Evaluation Runs
                </h2>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#cc785c]/10 text-[#cc785c] border border-[#cc785c]/20 text-xs font-semibold uppercase tracking-wider">
                <Sparkles size={13} />
                <span>{usage?.plan_name || "Starter Plan"}</span>
              </div>
            </div>

            {/* Run Counters Big Display */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="bg-[#faf9f5] border border-[#e6dfd8] rounded-2xl p-4 text-center">
                <span className="text-[11px] font-mono uppercase text-[#6c6a64]">Available</span>
                <p className="font-serif text-3xl sm:text-4xl text-[#cc785c] font-normal mt-1">
                  {remainingCredits}
                </p>
                <span className="text-[10px] text-[#6c6a64]">runs left</span>
              </div>

              <div className="bg-[#faf9f5] border border-[#e6dfd8] rounded-2xl p-4 text-center">
                <span className="text-[11px] font-mono uppercase text-[#6c6a64]">Used</span>
                <p className="font-serif text-3xl sm:text-4xl text-[#141413] font-normal mt-1">
                  {usedCredits}
                </p>
                <span className="text-[10px] text-[#6c6a64]">evaluations run</span>
              </div>

              <div className="bg-[#faf9f5] border border-[#e6dfd8] rounded-2xl p-4 text-center">
                <span className="text-[11px] font-mono uppercase text-[#6c6a64]">Total Quota</span>
                <p className="font-serif text-3xl sm:text-4xl text-[#141413] font-normal mt-1">
                  {totalCredits}
                </p>
                <span className="text-[10px] text-[#6c6a64]">runs / month</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs text-[#6c6a64]">
                <span>Monthly Quota Consumption</span>
                <span className="font-mono font-medium text-[#141413]">
                  {usedCredits} / {totalCredits} ({usagePercentage}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#efe9de] overflow-hidden p-0.5 border border-[#e6dfd8]">
                <div
                  className="h-full rounded-full bg-[#cc785c] transition-all duration-500"
                  style={{ width: `${Math.max(4, usagePercentage)}%` }}
                />
              </div>
            </div>

            {/* Quota Reset / Renewal Info */}
            <div className="p-4 rounded-2xl bg-[#faf9f5] border border-[#e6dfd8] flex items-center gap-3 text-xs text-[#6c6a64]">
              <Clock size={16} className="text-[#cc785c] shrink-0" />
              <div>
                <span className="font-medium text-[#141413]">Monthly Reset: </span>
                Evaluations refresh every billing cycle. Unused runs reset at the start of your next cycle.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                href="/screening"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#cc785c] hover:bg-[#a9583e] text-white font-medium text-xs transition-all shadow-xs"
              >
                <Zap size={15} />
                <span>Evaluate a Resume Now</span>
              </Link>

              {!isProMax && (
                <button
                  onClick={() => handleUpgradeCheckout(isPro ? "pro-max" : "pro")}
                  disabled={isUpgrading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#efe9de] hover:bg-[#e8e0d2] text-[#141413] border border-[#e6dfd8] font-medium text-xs transition-all"
                >
                  {isUpgrading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <CreditCard size={14} className="text-[#cc785c]" />
                  )}
                  <span>
                    {isUpgrading
                      ? "Opening Stripe..."
                      : isPro
                      ? "Upgrade to Pro Max (1,000 Runs)"
                      : "Upgrade to Pro (100 Runs)"}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Plan Details & Features (Right Column) */}
          <div className="lg:col-span-5 bg-white border border-[#e6dfd8] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-[#e6dfd8] pb-5">
              <span className="text-xs font-mono uppercase tracking-wider text-[#6c6a64]">
                Current Tier
              </span>
              <h3 className="font-serif text-2xl text-[#141413] mt-1 font-medium capitalize">
                {usage?.plan_name || "Starter Plan"}
              </h3>
              <p className="text-xs text-[#6c6a64] mt-1">
                {isProMax
                  ? "For enterprise talent operations with custom fine-tuning."
                  : isPro
                  ? "For scaling engineering and recruiting teams."
                  : "Free tier for testing AI candidate evaluation."}
              </p>
            </div>

            {/* Included Capabilities */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#6c6a64]">
                Plan Capabilities
              </h4>
              <ul className="space-y-3">
                {planFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#3d3d3a]">
                    <CheckCircle2 size={15} className="text-[#5db872] shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Need More Runs Banner */}
            {!isProMax && (
              <div className="p-5 rounded-2xl bg-[#141413] text-white space-y-3">
                <div className="flex items-center gap-2 text-[#cc785c] text-xs font-mono uppercase font-semibold">
                  <Sparkles size={14} />
                  <span>Need More Runs?</span>
                </div>
                <p className="text-xs text-[#a09d96] leading-relaxed">
                  Upgrade instantly via Stripe to unlock up to 1,000 CV screening runs and priority batch processing.
                </p>
                <Link
                  href="/#pricing"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-white hover:text-[#cc785c] transition-colors"
                >
                  <span>Compare All Plans</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#faf9f5] flex items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-[#6c6a64]">
            <Loader2 className="animate-spin text-[#cc785c]" size={20} />
            <span>Loading profile...</span>
          </div>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
