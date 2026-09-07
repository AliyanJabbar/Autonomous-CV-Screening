"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { Loader2, AlertCircle, ArrowLeft, ExternalLink, ShieldCheck } from "lucide-react";

function CheckoutRedirectContent() {
  const searchParams = useSearchParams();
  const { data: sessionData, isPending: isAuthPending } = useSession();

  const planParam = searchParams.get("plan")?.toLowerCase() || "pro";
  const intervalParam = searchParams.get("interval")?.toLowerCase() || "month";
  const priceIdParam = searchParams.get("price_id") || undefined;

  const [error, setError] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  useEffect(() => {
    // Wait until auth state is determined
    if (isAuthPending) return;

    let isMounted = true;

    const initiateCheckout = async () => {
      try {
        setError(null);
        const backendUrl =
          process.env.NEXT_PUBLIC_API_URL ||
          process.env.NEXT_PUBLIC_BACKEND_URL ||
          "https://aura-screening.fastapicloud.dev";

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        const userToken = sessionData?.session?.token;
        if (userToken) {
          headers["Authorization"] = `Bearer ${userToken}`;
        }

        const isYearly = intervalParam.includes("year");

        const response = await fetch(`${backendUrl}/payments/create-checkout-session`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            plan: planParam,
            interval: isYearly ? "year" : "month",
            price_id: priceIdParam,
            user_id: sessionData?.user?.id || undefined,
            user_email: sessionData?.user?.email || undefined,
            ui_mode: "hosted",
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(
            errData.detail || `Server returned ${response.status}: ${response.statusText}`
          );
        }

        const data = await response.json();

        if (data.url) {
          if (isMounted) {
            setCheckoutUrl(data.url);
            window.location.href = data.url;
          }
        } else {
          throw new Error("No Stripe checkout URL returned from the payment server.");
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Failed to redirect to Stripe checkout:", err);
          setError(err?.message || "Failed to initialize Stripe checkout.");
        }
      }
    };

    initiateCheckout();

    return () => {
      isMounted = false;
    };
  }, [planParam, intervalParam, priceIdParam, sessionData, isAuthPending]);

  return (
    <div className="min-h-screen bg-[#faf9f5] flex items-center justify-center py-16 px-4 sm:px-6">
      <div className="max-w-md w-full bg-white border border-[#e6dfd8] rounded-3xl p-8 sm:p-10 shadow-xs text-center">
        {error ? (
          <div className="space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 text-red-600 mx-auto flex items-center justify-center">
              <AlertCircle size={28} />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-2xl text-[#141413]">
                Unable to Open Stripe Checkout
              </h2>
              <p className="text-xs text-red-700 bg-red-50 p-3 rounded-xl border border-red-100 leading-relaxed text-left font-mono">
                {error}
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 px-4 rounded-xl bg-[#cc785c] text-white text-xs font-semibold hover:bg-[#a9583e] transition-colors"
              >
                Try Again
              </button>
              <Link
                href="/#pricing"
                className="inline-flex items-center justify-center gap-2 text-xs text-[#6c6a64] hover:text-[#141413] transition-colors py-2"
              >
                <ArrowLeft size={14} />
                Back to Pricing Plans
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Animated Stripe Transition Spinner */}
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-[#e6dfd8]" />
              <div className="absolute inset-0 rounded-full border-2 border-[#cc785c] border-t-transparent animate-spin" />
              <div className="w-9 h-9 rounded-full bg-[#faf9f5] flex items-center justify-center text-[#cc785c] font-mono text-xs font-bold">
                $
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#cc785c] font-semibold">
                Stripe Secure Gateway
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl text-[#141413] font-normal">
                Redirecting to Stripe...
              </h1>
              <p className="text-xs text-[#6c6a64] leading-relaxed max-w-xs mx-auto">
                Connecting directly to Stripe's secure checkout. Stripe solely manages your payment data.
              </p>
            </div>

            {/* Fallback button if browser blocks auto-navigation */}
            {checkoutUrl && (
              <div className="pt-2">
                <a
                  href={checkoutUrl}
                  className="inline-flex items-center gap-2 text-xs font-medium text-[#cc785c] hover:underline"
                >
                  Click here if not redirected automatically
                  <ExternalLink size={12} />
                </a>
              </div>
            )}

            <div className="pt-4 border-t border-[#e6dfd8] flex items-center justify-center gap-2 text-[11px] text-[#6c6a64]">
              <ShieldCheck size={14} className="text-[#5db872]" />
              <span>PCI-DSS Level 1 Encrypted • Direct Stripe UI</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#faf9f5] flex items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-[#6c6a64]">
            <Loader2 className="animate-spin text-[#cc785c]" size={20} />
            <span>Connecting to Stripe...</span>
          </div>
        </div>
      }
    >
      <CheckoutRedirectContent />
    </Suspense>
  );
}
