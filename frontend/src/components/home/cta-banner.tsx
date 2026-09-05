"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export default function CtaBanner() {
  return (
    <section className="py-24 bg-[#faf9f5]">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl bg-[#cc785c] px-8 py-14 md:px-16 md:py-20 text-white shadow-xl"
        >
          <div className="relative z-10 max-w-2xl space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight leading-[1.1]">
              Ready to elevate your talent evaluation pipeline?
            </h2>
            <p className="text-base sm:text-lg text-white/90 font-sans leading-relaxed">
              Transform unstructured candidate resumes into ranked, objective talent shortlists in minutes.
            </p>
            <div className="pt-2">
              <Link
                href="/todo"
                className="inline-flex items-center gap-2 rounded-md bg-[#faf9f5] px-6 py-3.5 text-sm font-semibold text-[#141413] transition-all hover:bg-[#efe9de] active:scale-95 shadow-xs"
              >
                <span>Launch Autonomous Portal</span>
                <ArrowRight size={16} className="text-[#cc785c]" />
              </Link>
            </div>
          </div>
          
          {/* Subtle Decorative Coral Glyph Background */}
          <div className="absolute right-8 bottom-4 opacity-10 pointer-events-none hidden lg:block">
            <svg className="w-80 h-80 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z" />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}