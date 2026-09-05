"use client";

import { motion } from "motion/react";

const stats = [
  { label: "Screening Precision Fit", value: "98.4%" },
  { label: "Faster Shortlisting Time", value: "12x" },
  { label: "Demographic Bias Ratio", value: "0%" },
  { label: "Resumes Evaluated Daily", value: "150k+" },
];

export default function StatSection() {
  return (
    <section className="border-y border-[#e6dfd8] bg-[#f5f0e8] py-16">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center space-y-1"
            >
              <div className="font-serif text-4xl md:text-5xl font-normal text-[#141413] tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs text-[#6c6a64] uppercase tracking-wider font-semibold font-sans">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}