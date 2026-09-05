"use client";

import { motion } from "motion/react";
import {
  FileCheck,
  Cpu,
  Sparkles,
  Users,
  Sliders,
  Shield,
  Layers,
  CheckCircle2,
} from "lucide-react";

export default function ProductMockup() {
  const candidates = [
    {
      name: "Elena Rostova",
      role: "Senior Staff Machine Learning Engineer",
      experience: "10 yrs exp • ex-DeepMind • PhD Tech University",
      matchScore: "98.2%",
      skills: ["PyTorch", "Distributed Training", "CUDA", "LLM Fine-Tuning"],
      status: "Shortlisted",
    },
    {
      name: "Marcus Vance",
      role: "Principal Infrastructure Architect",
      experience: "14 yrs exp • ex-[#Anthropic] • MS MIT",
      matchScore: "95.6%",
      skills: ["Kubernetes", "Rust", "Distributed Systems", "GPU Clusters"],
      status: "Shortlisted",
    },
    {
      name: "Priya Sharma",
      role: "Lead NLP Researcher & Algorithm Specialist",
      experience: "8 yrs exp • Carnegie Mellon MS",
      matchScore: "92.1%",
      skills: ["Transformers", "RAG Systems", "Vector Databases", "Python"],
      status: "Under Review",
    },
  ];

  return (
    <section id="pipeline" className="py-24 bg-[#faf9f5]">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Section Header */}
        <div className="mb-16 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#efe9de] border border-[#e6dfd8]">
            <Sparkles size={14} className="text-[#cc785c]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#141413]">
              AI Screening Pipeline
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#141413] tracking-tight font-normal">
            Inspect live candidate evaluation in real-time.
          </h2>

          <p className="text-base sm:text-lg text-[#3d3d3a] max-w-2xl mx-auto font-sans leading-relaxed">
            Observe how AuraScreening extracts candidate experience, checks semantic alignment against job specifications, and generates transparent evaluation logs.
          </p>
        </div>

        {/* Dark Navy Product Surface Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl bg-[#181715] p-4 sm:p-8 text-[#faf9f5] border border-[#252320] shadow-2xl space-y-6"
        >
          {/* Top Control Chrome */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#252320] pb-5">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#c64545]" />
                <div className="w-3 h-3 rounded-full bg-[#e8a55a]" />
                <div className="w-3 h-3 rounded-full bg-[#5db8a6]" />
              </div>
              <div className="h-4 w-px bg-[#252320]" />
              <div className="flex items-center gap-2 text-xs font-mono text-[#a09d96]">
                <FileCheck size={14} className="text-[#cc785c]" />
                <span>Job Requirement: Senior AI & Infrastructure Architect</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#a09d96] hidden sm:inline">
                Batch Run #4812 • 450 CVs
              </span>
              <span className="text-xs font-mono bg-[#cc785c] text-white px-3 py-1 rounded-md font-semibold">
                Autonomous Mode Active
              </span>
            </div>
          </div>

          {/* Main Pipeline Interface Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Sidebar - Evaluation Controls (4 cols) */}
            <div className="lg:col-span-4 bg-[#1f1e1b] rounded-xl p-5 border border-[#252320] space-y-5">
              <div className="text-xs font-mono font-bold text-[#a09d96] uppercase tracking-wider">
                Evaluation Criteria Weights
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#faf9f5]">Core Technical Mastery</span>
                    <span className="text-[#cc785c]">40%</span>
                  </div>
                  <div className="w-full bg-[#252320] h-2 rounded-full">
                    <div className="bg-[#cc785c] h-full rounded-full w-[40%]" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#faf9f5]">System Architecture & Scale</span>
                    <span className="text-[#cc785c]">30%</span>
                  </div>
                  <div className="w-full bg-[#252320] h-2 rounded-full">
                    <div className="bg-[#cc785c] h-full rounded-full w-[30%]" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#faf9f5]">Leadership & Impact</span>
                    <span className="text-[#cc785c]">20%</span>
                  </div>
                  <div className="w-full bg-[#252320] h-2 rounded-full">
                    <div className="bg-[#cc785c] h-full rounded-full w-[20%]" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#faf9f5]">Domain Alignment</span>
                    <span className="text-[#cc785c]">10%</span>
                  </div>
                  <div className="w-full bg-[#252320] h-2 rounded-full">
                    <div className="bg-[#cc785c] h-full rounded-full w-[10%]" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#252320] space-y-3">
                <div className="flex items-center justify-between text-xs text-[#a09d96]">
                  <span>Blind Bias Shield</span>
                  <span className="text-[#5db8a6] font-mono">ENABLED</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#a09d96]">
                  <span>Strict Experience Guard</span>
                  <span className="text-[#5db8a6] font-mono">ACTIVE (8+ yrs)</span>
                </div>
              </div>
            </div>

            {/* Right Main Panel - Candidate Score List (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-[#a09d96] pb-1">
                <span>RANK ORDERED CANDIDATE MATCHES</span>
                <span>SORTED BY CONFIDENCE SCORE</span>
              </div>

              {candidates.map((candidate, idx) => (
                <div
                  key={idx}
                  className="bg-[#252320] rounded-xl p-4 border border-[#3d3d3a]/30 hover:border-[#cc785c]/50 transition-colors space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-[#cc785c]">
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-white flex items-center gap-2">
                          {candidate.name}
                          {idx === 0 && (
                            <span className="text-[10px] bg-[#5db8a6]/20 text-[#5db8a6] border border-[#5db8a6]/30 px-2 py-0.5 rounded-full font-mono">
                              TOP MATCH
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#a09d96]">
                          {candidate.role} • {candidate.experience}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-mono font-bold text-[#5db8a6]">
                        {candidate.matchScore}
                      </div>
                      <div className="text-[10px] text-[#a09d96] font-mono">MATCH FIT</div>
                    </div>
                  </div>

                  {/* Skills badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1f1e1b]">
                    <div className="flex flex-wrap gap-1.5">
                      {candidate.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[11px] font-mono bg-[#1f1e1b] text-[#faf9f5] px-2 py-0.5 rounded border border-[#3d3d3a]/40"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <span className="text-xs font-mono text-[#5db8a6] flex items-center gap-1">
                      <CheckCircle2 size={13} />
                      {candidate.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}

