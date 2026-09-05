"use client";

import { motion } from "motion/react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Aris Thorne",
    role: "VP of Global Talent Acquisition, Apex BioLabs",
    content: "AuraScreening reduced our engineering shortlisting timeframe from 3 weeks to 40 minutes. The candidate match logs give our hiring managers total clarity.",
    avatar: "AT"
  },
  {
    name: "Eleanor Vance",
    role: "Head of Recruiting, Horizon AI",
    content: "The demographic bias shield completely transformed our hiring pipeline integrity. We hired our highest-performing cohort in company history.",
    avatar: "EV"
  },
  {
    name: "Marcus Sterling",
    role: "Director of HR, Quantum Dynamics",
    content: "The level of semantic precision in resume parsing is extraordinary. It accurately understands complex technical roles without missing passive talent.",
    avatar: "MS"
  }
];

export default function Testimonials() {
  return (
    <section id="testimonial" className="py-24 bg-[#faf9f5] border-t border-[#e6dfd8]">
      <div className="container mx-auto px-6 max-w-6xl space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-[#cc785c] font-semibold">
            Industry Endorsements
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#141413] tracking-tight font-normal">
            Trusted by global talent organizations.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-[#e6dfd8] bg-[#efe9de] p-8 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <Quote size={20} className="text-[#cc785c]" />
                <p className="text-sm text-[#3d3d3a] leading-relaxed font-sans font-normal">
                  "{t.content}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#e6dfd8]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#cc785c] text-xs font-medium text-white shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-medium text-[#141413]">{t.name}</div>
                  <div className="text-xs text-[#6c6a64]">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}