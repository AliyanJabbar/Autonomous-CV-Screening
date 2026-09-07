"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Check, ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { useSession } from "@/lib/auth-client";

const tiers = [
  {
    name: "Starter",
    price: { monthly: "$0", yearly: "$0" },
    description: "Ideal for small teams testing AI candidate evaluation.",
    features: [
      "Up to 10 CV evaluations / mo",
      "Standard criteria matching engine",
      "Demographic bias shield",
      "CSV & PDF export",
    ],
    buttonText: "Start Free Screening",
    highlight: false,
  },
  {
    name: "Pro",
    price: { monthly: "$25", yearly: "$20" },
    description: "For scaling engineering and talent acquisition teams.",
    features: [
      "Up to 100 CV evaluations / mo",
      "Multiple CV's evaluation in a single run",
      "Real-time AI decision audit logs",
      "Greenhouse & Lever ATS connectors",
      "Priority batch processing",
    ],
    buttonText: "Upgrade to Pro",
    highlight: true,
  },
  {
    name: "Pro Max",
    price: { monthly: "$120", yearly: "$100" },
    description: "For global enterprises with high-volume recruitment.",
    features: [
      "Up to 1000 CV evaluations",
      "Custom LLM fine-tuning on company taxonomy",
      "Dedicated SOC2 & GDPR compliance shield",
      "SLA guaranteed inference speed",
      "Dedicated HR solutions architect",
    ],
    buttonText: "Contact Sales",
    highlight: false,
  },
];

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { data: sessionData } = useSession();

  const handleCheckout = async (tierName: string) => {
    if (tierName === "Starter") {
      window.location.href = "/screening";
      return;
    }

    try {
      setLoadingTier(tierName);
      setErrorMessage(null);

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
          plan: tierName.toLowerCase().replace(/\s+/g, "-"),
          interval: isYearly ? "year" : "month",
          user_id: sessionData?.user?.id || undefined,
          user_email: sessionData?.user?.email || undefined,
          ui_mode: "hosted",
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Server returned status ${res.status}`);
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No Stripe checkout URL returned from server.");
      }
    } catch (err: any) {
      console.error("Stripe checkout initiation failed:", err);
      setErrorMessage(
        err?.message || "Failed to redirect to Stripe checkout. Please try again."
      );
      setLoadingTier(null);
    }
  };

  return (
    <section id="pricing" className="py-24 bg-[#faf9f5] border-t border-[#e6dfd8]">
      <div className="container mx-auto px-6 max-w-6xl space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-[#cc785c] font-semibold">
            Transparent Pricing
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#141413] tracking-tight font-normal">
            Predictable plans for modern recruitment.
          </h2>
          <p className="text-base text-[#3d3d3a]">
            Choose the capacity that matches your hiring velocity.
          </p>

          {/* Billing Toggle */}
          <div className="pt-4 flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${!isYearly ? "text-[#141413]" : "text-[#6c6a64]"}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative h-6 w-12 rounded-full bg-[#efe9de] p-1 border border-[#e6dfd8] transition-colors"
            >
              <motion.div
                animate={{ x: isYearly ? 24 : 0 }}
                className="h-4 w-4 rounded-full bg-[#cc785c]"
              />
            </button>
            <span className={`text-sm font-medium ${isYearly ? "text-[#141413]" : "text-[#6c6a64]"}`}>
              Yearly <span className="text-xs text-[#5db872] font-semibold">(Save 20%)</span>
            </span>
          </div>

          {errorMessage && (
            <div className="mx-auto max-w-md p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {tiers.map((tier, ind) => {
            const isLoading = loadingTier === tier.name;
            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: ind * 0.1 }}
                className={`relative flex flex-col rounded-xl p-8 transition-all ${tier.highlight
                  ? "bg-[#181715] text-[#faf9f5] shadow-xl border border-[#252320]"
                  : "bg-[#faf9f5] text-[#141413] border border-[#e6dfd8]"
                  }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#cc785c] px-3 py-0.5 text-[11px] font-mono font-semibold uppercase tracking-wider text-white">
                    FEATURED TIER
                  </div>
                )}

                <div className="mb-8 space-y-3">
                  <h3 className={`text-xl font-medium ${tier.highlight ? "text-[#faf9f5]" : "text-[#141413]"}`}>
                    {tier.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-4xl md:text-5xl font-normal">
                      {isYearly ? tier.price.yearly : tier.price.monthly}
                    </span>
                    <span className={`text-sm ${tier.highlight ? "text-[#a09d96]" : "text-[#6c6a64]"}`}>
                      /month
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed ${tier.highlight ? "text-[#a09d96]" : "text-[#3d3d3a]"}`}>
                    {tier.description}
                  </p>
                </div>

                <ul className="mb-8 flex-1 space-y-3 border-t pt-6 border-current/10">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-xs font-sans">
                      <Check size={16} className={`shrink-0 ${tier.highlight ? "text-[#5db8a6]" : "text-[#cc785c]"}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleCheckout(tier.name)}
                  disabled={isLoading || loadingTier !== null}
                  className={`flex h-11 items-center justify-center rounded-md text-xs font-semibold transition-all disabled:opacity-60 ${tier.highlight
                    ? "bg-[#cc785c] text-white hover:bg-[#a9583e]"
                    : "bg-[#efe9de] text-[#141413] hover:bg-[#e8e0d2] border border-[#e6dfd8]"
                    }`}
                >
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin" />
                      Redirecting to Stripe...
                    </span>
                  ) : (
                    tier.buttonText
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-[#6c6a64]">
          <ShieldCheck size={16} className="text-[#5db872]" />
          <span>Enterprise-grade security • GDPR & EEOC compliant • Cancel anytime</span>
        </div>
      </div>
    </section>
  );
}


