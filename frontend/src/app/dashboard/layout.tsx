import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BRAND } from "@/config/branding";
import DashboardSidebar from "@/components/DashboardSidebar";
import { UserCircle, Moon, Sun } from "lucide-react";
"use client";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-app text-foreground font-sans overflow-hidden">
      <DashboardSidebar userName={session.user?.name || "User"} userEmail={session.user?.email || ""} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Top bar */}
        <header className="glass sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border/70 px-4 md:px-6 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-muted-foreground">
            <span className="inline-flex h-6 items-center rounded-full border border-border bg-surface/80 px-2 text-[11px] uppercase tracking-[0.12em]">
              {BRAND.name} Workspace
            </span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <ThemeToggle />
            <button className="flex items-center gap-2 rounded-full border border-border bg-surface/80 px-2.5 py-1.5 text-xs md:text-sm font-medium text-foreground hover:bg-muted transition-colors">
              <UserCircle className="h-5 w-5 text-muted-foreground" />
              <span className="hidden sm:inline">
                {session.user?.name?.split(" ")[0] ?? "You"}
              </span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto w-full p-4 md:p-8 lg:p-10 hide-scrollbar">
          <div className="mx-auto flex h-full w-full max-w-6xl flex-col">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();

  React.useEffect(() => setMounted(true), []);
  if (!mounted) return (
    <div className="h-8 w-8 rounded-full border border-border bg-muted" />
  );

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-8 items-center justify-between rounded-full border border-border bg-surface/80 px-1 text-xs text-muted-foreground hover:bg-muted transition-colors gap-1.5"
    >
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
          !isDark ? "bg-blue-500 text-white" : "text-muted-foreground"
        }`}
      >
        <Sun className="h-3.5 w-3.5" />
      </span>
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
          isDark ? "bg-slate-900 text-yellow-300" : "text-muted-foreground"
        }`}
      >
        <Moon className="h-3.5 w-3.5" />
      </span>
    </button>
  );
}

