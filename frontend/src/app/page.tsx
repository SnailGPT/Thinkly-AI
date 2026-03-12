"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, PlayCircle, Zap, FileText, Bot, Layers, Search } from "lucide-react";
import { BRAND } from "@/config/branding";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-app text-foreground font-sans selection:bg-blue-200 relative overflow-hidden">
      {/* Gradient backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),transparent_55%),_radial-gradient(circle_at_20%_80%,_rgba(139,92,246,0.22),transparent_55%),_radial-gradient(circle_at_80%_80%,_rgba(34,211,238,0.18),transparent_55%)]" />

      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50">
        <div className="mx-auto max-w-6xl px-4 lg:px-6 pt-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="glass flex h-14 items-center justify-between rounded-2xl px-4 lg:px-6 shadow-[0_18px_60px_rgba(15,23,42,0.18)]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-lg shadow-blue-500/40 text-lg font-semibold">
                T
              </div>
              <div className="flex flex-col">
                <span className="font-semibold tracking-tight text-sm">{BRAND.name}</span>
                <span className="text-[11px] text-muted-foreground font-medium tracking-wide">
                  Your AI Study Companion
                </span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
              <Link href="#how-it-works" className="hover:text-foreground transition-colors">How it works</Link>
              <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
              <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
              <Link href="/dashboard/chat" className="hover:text-foreground transition-colors">AI Chat</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center justify-center rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-blue-500/50 hover:bg-blue-50/60 transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 px-4 py-1.5 text-xs font-semibold text-white shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Start Free
              </Link>
            </div>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 md:pt-40 lg:pt-44 pb-20 lg:pb-28 px-6 lg:px-12 overflow-hidden flex flex-col items-center justify-center text-center">

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-surface/80 border border-border text-[11px] font-semibold text-muted-foreground shadow-sm mb-6 z-10"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Built on modern AI models for lectures, notes & quizzes
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white max-w-4xl z-10 leading-[1.05] font-[var(--font-sora)]"
        >
          Study Smarter with{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400">
            Thinkly AI
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl font-medium z-10"
        >
          Upload lectures and instantly generate notes, flashcards, quizzes, and AI-powered explanations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-8 z-10"
        >
          <Link
            href="/signup"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 text-white font-semibold text-sm md:text-base shadow-[0_18px_50px_rgba(59,130,246,0.55)] hover:shadow-[0_22px_55px_rgba(59,130,246,0.75)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            Start Studying Free <ArrowRight className="w-4 h-4" />
          </Link>
          <button className="w-full sm:w-auto px-7 py-3.5 rounded-full border border-border bg-surface/80 text-sm md:text-base font-semibold text-foreground shadow-sm hover:bg-muted hover:border-blue-400/60 transition-all flex items-center justify-center gap-2">
            <PlayCircle className="w-4 h-4 text-blue-400" /> See Demo
          </button>
        </motion.div>

        {/* Dashboard Preview Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-14 md:mt-16 relative w-full max-w-5xl z-10"
        >
          <div className="glass rounded-[1.75rem] border border-white/70 dark:border-slate-700/70 bg-white/70 dark:bg-slate-900/70 shadow-[0_24px_70px_rgba(15,23,42,0.3)] p-3">
            <div className="rounded-2xl overflow-hidden border border-border bg-surface dark:bg-slate-900">
              <div className="h-10 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-border flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="mx-auto flex h-6 items-center justify-center rounded-md border border-slate-700/80 bg-slate-900/80 px-3 text-[10px] font-mono text-slate-400">
                  thinkly.ai/dashboard
                </div>
              </div>
              <div className="grid grid-cols-4 md:h-[360px]">
                <div className="relative col-span-1 hidden border-r border-border/80 bg-slate-950/40 p-3 md:flex flex-col gap-2">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.05 }}
                      className="h-7 rounded-lg bg-slate-800/80 border border-slate-700/80"
                    />
                  ))}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/60" />
                </div>
                <div className="col-span-4 md:col-span-3 p-5 md:p-7 flex flex-col gap-4 bg-surface/90 dark:bg-slate-900/90">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <span className="inline-flex h-6 items-center rounded-full border border-border bg-muted/70 px-2">
                        <BrainCircuit className="mr-1.5 h-3 w-3 text-blue-500" />
                        AI study workspace
                      </span>
                    </div>
                    <div className="hidden md:inline-flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="inline-flex h-6 items-center rounded-full border border-border bg-slate-900 text-slate-100 px-2">
                        Live demo
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.div
                      initial={{ y: 18, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.45, type: "spring", stiffness: 220, damping: 24 }}
                      className="card-elevated bg-gradient-to-br from-blue-50 to-slate-50 dark:from-blue-500/15 dark:to-slate-900/40 p-4 flex flex-col gap-2"
                    >
                      <p className="text-xs font-semibold text-blue-600 uppercase tracking-[0.12em]">
                        Notes
                      </p>
                      <p className="text-sm text-slate-700 dark:text-slate-100 line-clamp-3">
                        “Gradient descent adjusts model weights to minimize the loss
                        function by following the negative gradient…”
                      </p>
                    </motion.div>
                    <motion.div
                      initial={{ y: 18, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.52, type: "spring", stiffness: 220, damping: 24 }}
                      className="card-elevated bg-gradient-to-br from-violet-50 to-slate-50 dark:from-violet-500/10 dark:to-slate-900/40 p-4 flex flex-col gap-2"
                    >
                      <p className="text-xs font-semibold text-violet-600 uppercase tracking-[0.12em]">
                        Flashcards
                      </p>
                      <p className="text-sm text-slate-700 dark:text-slate-100 line-clamp-3">
                        Q: What does a larger learning rate do to convergence?
                      </p>
                    </motion.div>
                    <motion.div
                      initial={{ y: 18, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6, type: "spring", stiffness: 220, damping: 24 }}
                      className="card-elevated bg-gradient-to-br from-cyan-50 to-slate-50 dark:from-cyan-500/10 dark:to-slate-900/40 p-4 flex flex-col gap-2"
                    >
                      <p className="text-xs font-semibold text-cyan-600 uppercase tracking-[0.12em]">
                        Quiz
                      </p>
                      <p className="text-sm text-slate-700 dark:text-slate-100 line-clamp-3">
                        “Which optimizer adapts learning rates for each parameter?”
                      </p>
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.75 }}
                    className="mt-1 rounded-2xl border border-border bg-surface/80 dark:bg-slate-950/60 p-3 text-left flex gap-3 items-start"
                  >
                    <div className="mt-1 h-7 w-7 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs shadow-lg">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-foreground flex items-center gap-2">
                        AI Tutor
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      </p>
                      <p className="text-xs text-muted-foreground">
                        “Here’s the key idea behind this lecture in 3 bullet points…”
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white px-6 lg:px-12 border-t border-gray-100 text-center">
        <h2 className="text-3xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">From lecture to mastery.</h2>
        <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto mb-16">
          Everything you need to digest overwhelming courses and ace your exams, powered by state-of-the-art AI.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-left">
          {[
            { icon: FileText, title: "Executive Notes", desc: "Instantly convert 2-hour videos into structured, beautiful notes.", color: "text-blue-600", bg: "bg-blue-50" },
            { icon: Zap, title: "Spaced Repetition", desc: "AI automatically extracts key concepts into flashcards.", color: "text-purple-600", bg: "bg-purple-50" },
            { icon: BrainCircuit, title: "Mock Quizzes", desc: "Test your knowledge before the exam with customized quizzes.", color: "text-emerald-600", bg: "bg-emerald-50" },
            { icon: Layers, title: "Multi-modal Upload", desc: "Works with YouTube links, MP4, MP3, PDF, or raw text.", color: "text-amber-600", bg: "bg-amber-50" },
            { icon: Bot, title: "Chat with Lectures", desc: "Semantic search engine to ask questions and find answers instantly.", color: "text-indigo-600", bg: "bg-indigo-50" },
            { icon: Search, title: "Knowledge Base", desc: "Organize all your study materials into a searchable vault.", color: "text-rose-600", bg: "bg-rose-50" },
          ].map((Feature, i) => (
            <div key={i} className="p-8 rounded-[2rem] border border-gray-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className={`w-14 h-14 ${Feature.bg} ${Feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                <Feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{Feature.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed">{Feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gray-50 px-6 lg:px-12 text-center border-t border-gray-200">
        <h2 className="text-3xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Simple, transparent pricing.</h2>
        <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto mb-16">
          Start for free. Upgrade when you need unlimited AI power.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
          <div className="p-10 rounded-[2rem] border border-gray-200 bg-white shadow-sm flex flex-col">
            <h3 className="text-2xl font-bold text-gray-900">Basic Plan</h3>
            <div className="mt-4 mb-6"><span className="text-5xl font-black text-gray-900">$0</span><span className="text-gray-500 font-medium tracking-wide"> / month</span></div>
            <ul className="space-y-4 mb-10 flex-1 text-gray-600 font-medium">
              <li className="flex items-center gap-3"><span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex justify-center items-center text-xs">✓</span> 3 lecture uploads per day</li>
              <li className="flex items-center gap-3"><span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex justify-center items-center text-xs">✓</span> 10 AI chat queries per day</li>
              <li className="flex items-center gap-3"><span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex justify-center items-center text-xs">✓</span> Basic Notes & Quizzes</li>
            </ul>
            <Link href="/signup" className="w-full py-4 text-center rounded-xl bg-gray-100 text-gray-900 font-bold hover:bg-gray-200 transition-colors">Get Started Free</Link>
          </div>

          <div className="p-10 rounded-[2rem] border-2 border-blue-600 bg-blue-600 shadow-2xl shadow-blue-600/20 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 bg-white/20 text-white font-bold text-xs uppercase tracking-widest rounded-bl-3xl">Most Popular</div>
            <h3 className="text-2xl font-bold text-white relative z-10">Pro Plan</h3>
            <div className="mt-4 mb-6 relative z-10"><span className="text-5xl font-black text-white">$10</span><span className="text-blue-100 font-medium tracking-wide"> / month</span></div>
            <ul className="space-y-4 mb-10 flex-1 text-blue-50 font-medium relative z-10">
              <li className="flex items-center gap-3"><span className="w-5 h-5 rounded-full bg-blue-400 text-white flex justify-center items-center text-xs">✓</span> Unlimited lecture uploads</li>
              <li className="flex items-center gap-3"><span className="w-5 h-5 rounded-full bg-blue-400 text-white flex justify-center items-center text-xs">✓</span> Unlimited AI chat queries</li>
              <li className="flex items-center gap-3"><span className="w-5 h-5 rounded-full bg-blue-400 text-white flex justify-center items-center text-xs">✓</span> Priority processing speed</li>
              <li className="flex items-center gap-3"><span className="w-5 h-5 rounded-full bg-blue-400 text-white flex justify-center items-center text-xs">✓</span> Advanced Semantic Vector Search</li>
            </ul>
            <Link href="/signup" className="w-full py-4 text-center rounded-xl bg-white text-blue-600 shadow-lg font-bold hover:scale-105 active:scale-95 transition-all relative z-10">Upgrade to Pro</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-gray-100 px-6 lg:px-12 text-center text-gray-400 font-medium text-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-bold text-gray-900">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-md flex items-center justify-center text-xs">T</div> {BRAND.name}
          </div>
          <div className="flex gap-6 text-gray-500">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
          <div>&copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

const Sparkles = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4M3 5h4M19 3v4M17 5h4M19 17v4M17 19h4" />
  </svg>
)
