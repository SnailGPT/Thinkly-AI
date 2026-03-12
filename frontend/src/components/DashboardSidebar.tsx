"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Upload,
  FileText,
  Zap,
  BrainCircuit,
  Settings,
  LogOut,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { BRAND } from "@/config/branding";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function DashboardSidebar({ userName, userEmail }: { userName: string; userEmail: string }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Upload, label: "Lectures", href: "/dashboard/lectures" },
    { icon: FileText, label: "Notes", href: "/dashboard/notes" },
    { icon: Zap, label: "Flashcards", href: "/dashboard/flashcards" },
    { icon: BrainCircuit, label: "Quizzes", href: "/dashboard/quizzes" },
    { icon: MessageSquare, label: "AI Chat", href: "/dashboard/chat" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <motion.aside
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="hidden md:flex h-screen flex-col border-r border-border bg-[hsl(var(--card))]/95 backdrop-blur-xl shadow-[10px_0_60px_rgba(15,23,42,0.22)]"
      style={{ width: collapsed ? 80 : 272 }}
    >
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/40">
            T
          </div>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                className="flex flex-col"
              >
                <span className="text-sm font-semibold tracking-tight text-foreground">{BRAND.name}</span>
                <span className="text-[11px] text-muted-foreground font-medium tracking-wide">Workspace</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </div>

      <nav className="mt-2 flex-1 space-y-1 overflow-y-auto px-2 py-2">
        {sidebarItems.map((item, i) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={i}
              href={item.href}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-300"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {isActive && (
                <span className="absolute inset-y-1 left-1 w-1 rounded-full bg-gradient-to-b from-blue-500 to-violet-500" />
              )}
              <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:text-blue-500 group-hover:bg-blue-50 dark:bg-slate-900/80">
                <item.icon className="h-[18px] w-[18px]" />
              </span>
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -4 }}
                    className="relative"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border/70 px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-100 text-xs font-semibold text-slate-700 dark:from-slate-700 dark:to-slate-800 dark:text-slate-100">
              {userName[0]?.toUpperCase()}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-foreground">{userName}</p>
                <p className="truncate text-[11px] text-muted-foreground">{userEmail}</p>
              </div>
            )}
          </div>
          <button
            onClick={() => signOut()}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.aside>
  );
}

