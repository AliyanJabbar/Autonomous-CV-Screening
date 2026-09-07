"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";

interface SessionStatusData {
  status: string;
  payment_status: string;
  customer_email: string | null;
  client_reference_id: string | null;
  metadata?: Record<string, any>;
}

function ReturnContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [sessionData, setSessionData] = useState<SessionStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("No checkout session_id detected in URL query parameters.");
      setLoading(false);
      return;
    }

    const fetchSessionStatus = async () => {
      try {
        const backendUrl =
          process.env.NEXT_PUBLIC_API_URL ||
          process.env.NEXT_PUBLIC_BACKEND_URL ||
          "http://localhost:8000";

        const res = await fetch(
          `${backendUrl}/payments/session-status?session_id=${encodeURIComponent(
            sessionId
          )}`
        );

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error(
            errBody.detail || `Server returned error status ${res.status}`
          );
        }

        const data: SessionStatusData = await res.json();
        setSessionData(data);
      } catch (err: any) {
        setError(err.message || "Unable to verify session status with server.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessionStatus();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="animate-spin text-[#cc785c] mb-4" size={36} />
        <h2 className="font-serif text-2xl text-[#141413]">
          Confirming Payment with Stripe...
        </h2>
        <p className="text-xs text-[#6c6a64] mt-2 max-w-sm">
          We are synchronizing your subscription state. Please wait a moment.
        </p>
      </div>
    );
  }

  const isCompleted =
    sessionData?.status === "complete" || sessionData?.payment_status === "paid";

  return (
    <div className="min-h-screen bg-[#faf9f5] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="bg-white border border-[#e6dfd8] rounded-3xl p-8 sm:p-10 shadow-sm text-center">
          {isCompleted ? (
            <>
              {/* Success Badge */}
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center mb-6 shadow-xs">
                <CheckCircle size={36} />
              </div>

              <span className="text-xs font-mono uppercase tracking-widest text-[#cc785c] font-semibold">
                Payment Received
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#141413] mt-2 font-normal">
                Welcome to Autonomous Screening!
              </h1>

              <p className="text-sm text-[#6c6a64] mt-3 leading-relaxed">
                Your subscription has been activated. A confirmation receipt has been sent to{" "}
                <span className="font-medium text-[#141413]">
                  {sessionData?.customer_email || "your email address"}
                </span>
                .
              </p>

              {/* Order Info Card */}
              <div className="mt-8 bg-[#faf9f5] border border-[#e6dfd8] rounded-2xl p-5 text-left text-xs space-y-3">
                <div className="flex justify-between items-center text-[#6c6a64]">
                  <span>Status</span>
                  <span className="font-semibold text-emerald-600 capitalize bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {sessionData?.status || "Active"}
                  </span>
                </div>

                {sessionData?.metadata?.plan && (
                  <div className="flex justify-between items-center text-[#6c6a64]">
                    <span>Plan</span>
                    <span className="font-medium text-[#141413] capitalize">
                      {sessionData.metadata.plan} Tier
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center text-[#6c6a64]">
                  <span>Reference ID</span>
                  <span className="font-mono text-[11px] text-[#3d3d3a] truncate max-w-[200px]">
                    {sessionData?.client_reference_id || sessionId}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#e6dfd8] flex items-center gap-2 text-[11px] text-[#6c6a64]">
                  <ShieldCheck size={14} className="text-[#5db872]" />
                  <span>Provisioned safely via Stripe Webhook backend architecture</span>
                </div>
              </div>

              {/* Action CTA */}
              <div className="mt-8 space-y-3">
                <Link
                  href="/screening"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#cc785c] hover:bg-[#a9583e] text-white font-medium text-sm transition-all shadow-xs"
                >
                  <FileCheck2 size={18} />
                  <span>Start Autonomous CV Screening</span>
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/"
                  className="block text-xs text-[#6c6a64] hover:text-[#141413] transition-colors py-2"
                >
                  Return to Homepage
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Pending or Error State */}
              <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-amber-600 mx-auto flex items-center justify-center mb-6">
                <Clock size={32} />
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl text-[#141413]">
                Order Processing
              </h1>
              <p className="text-xs text-[#6c6a64] mt-2 leading-relaxed">
                {error ||
                  "Your checkout session is being finalized by Stripe. If payment was authorized, your subscription will be credited shortly."}
              </p>

              <div className="mt-6 flex flex-col gap-2">
                <Link
                  href="/screening"
                  className="w-full py-3 px-6 rounded-xl bg-[#141413] text-white text-xs font-medium hover:bg-[#252320] transition-colors"
                >
                  Go to Application
                </Link>
                <Link
                  href="/#pricing"
                  className="text-xs text-[#6c6a64] hover:text-[#141413] py-2"
                >
                  Back to Pricing
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CheckoutReturnPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#faf9f5] flex items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-[#6c6a64]">
            <Loader2 className="animate-spin text-[#cc785c]" size={20} />
            <span>Verifying session...</span>
          </div>
        </div>
      }
    >
      <ReturnContent />
    </Suspense>
  );
}
