"use client";

import { motion } from "motion/react";
import { Cpu, ShieldCheck, Radar, UserCheck, Terminal, Network } from "lucide-react";

const features = [
  {
    title: "Autonomous Resume Parsing",
    desc: "Extracts work history, educational prestige, technical stack, and impact metrics with multi-model document understanding.",
    icon: Cpu,
    delay: 0,
  },
  {
    title: "Semantic Criteria Matching",
    desc: "Evaluates candidates against complex, implicit hiring requirements beyond keyword matching.",
    icon: Radar,
    delay: 0.1,
  },
  {
    title: "Demographic Bias Shield",
    desc: "Anonymizes names, ages, locations, and personal identifiers to ensure 100% merit-based evaluation.",
    icon: ShieldCheck,
    delay: 0.2,
  },
  {
    title: "Transparent AI Audit Stream",
    desc: "Generates clear, step-by-step reasoning logs explaining why each candidate was shortlisted or rejected.",
    icon: Terminal,
    delay: 0.3,
  },
  {
    title: "Instant Rank Ordering",
    desc: "Produces real-time confidence scores and ranked shortlists across batches of thousands of resumes.",
    icon: UserCheck,
    delay: 0.4,
  },
  {
    title: "ATS & Pipeline Sync",
    desc: "Seamlessly exports top candidates to Greenhouse, Lever, Workday, or custom HR endpoints.",
    icon: Network,
    delay: 0.5,
  },
];

export default function FeatureGrid() {
  return (
    <section id="capabilities" className="py-24 bg-[#faf9f5]">
      <div className="container mx-auto px-6 max-w-6xl space-y-12">
        {/* Section Title */}
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-[#cc785c] font-semibold">
            Core Architecture
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#141413] tracking-tight font-normal">
            Designed for talent teams who require rigor and speed.
          </h2>
        </div>

        {/* 3-Up Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: item.delay }}
              className="rounded-xl border border-[#e6dfd8] bg-[#efe9de] p-8 space-y-4 hover:border-[#cc785c]/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-md bg-[#faf9f5] border border-[#e6dfd8] flex items-center justify-center text-[#cc785c]">
                <item.icon size={20} />
              </div>
              <h3 className="font-serif text-xl text-[#141413] font-medium leading-snug">
                {item.title}
              </h3>
              <p className="text-sm text-[#3d3d3a] leading-relaxed font-sans">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}