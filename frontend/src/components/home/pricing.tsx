"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Check, ShieldCheck } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    name: "Starter",
    price: { monthly: "$0", yearly: "$0" },
    description: "Ideal for small teams testing AI candidate evaluation.",
    features: [
      "Up to 100 CV evaluations / mo",
      "Standard criteria matching engine",
      "Demographic bias shield",
      "CSV & PDF export",
    ],
    buttonText: "Start Free Screening",
    highlight: false,
  },
  {
    name: "Talent Pro",
    price: { monthly: "$149", yearly: "$119" },
    description: "For scaling engineering and talent acquisition teams.",
    features: [
      "Up to 5,000 CV evaluations / mo",
      "Advanced multi-criteria semantic radar",
      "Real-time AI decision audit logs",
      "Greenhouse & Lever ATS connectors",
      "Priority batch processing",
    ],
    buttonText: "Upgrade to Pro",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: { monthly: "$499", yearly: "$399" },
    description: "For global enterprises with high-volume recruitment.",
    features: [
      "Unlimited CV evaluations",
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
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {tiers.map((tier, ind) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: ind * 0.1 }}
              className={`relative flex flex-col rounded-xl p-8 transition-all ${
                tier.highlight
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

              <Link
                href="/todo"
                className={`flex h-11 items-center justify-center rounded-md text-xs font-semibold transition-all ${
                  tier.highlight
                    ? "bg-[#cc785c] text-white hover:bg-[#a9583e]"
                    : "bg-[#efe9de] text-[#141413] hover:bg-[#e8e0d2] border border-[#e6dfd8]"
                }`}
              >
                {tier.buttonText}
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-[#6c6a64]">
          <ShieldCheck size={16} className="text-[#5db872]" />
          <span>Enterprise-grade security • GDPR & EEOC compliant • Cancel anytime</span>
        </div>
      </div>
    </section>
  );
}

