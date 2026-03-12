import { User, Shield, CreditCard, Bell, Moon, Sun, LogOut, ChevronRight, Settings as SettingsIcon, CheckCircle2, Monitor } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function SettingsPage() {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const user = userId
        ? await prisma.user.findUnique({
            where: { id: userId },
            include: { subscription: true },
        })
        : null;

    const sections = [
        { label: "Account", icon: User, color: "text-blue-500 bg-blue-50" },
        { label: "Security", icon: Shield, color: "text-emerald-500 bg-emerald-50" },
        { label: "Subscription", icon: CreditCard, color: "text-purple-500 bg-purple-50" },
        { label: "Notifications", icon: Bell, color: "text-orange-500 bg-orange-50" },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">

            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm space-y-10">
                {/* Profile Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground shadow-md shadow-primary/20 relative overflow-hidden group">
                            {(session?.user?.name ?? "U").charAt(0).toUpperCase()}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                                <SettingsIcon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold text-foreground font-serif">
                                {session?.user?.name ?? "Your account"}
                            </h1>
                            <p className="text-sm text-muted-foreground font-medium">
                                {session?.user?.email ?? ""}
                            </p>
                        </div>
                    </div>
                    <button className="px-6 py-2.5 bg-secondary text-foreground rounded-lg font-medium text-sm hover:bg-secondary/80 transition-colors border border-border/50">
                        Edit Profile
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-border">
                    {/* General Settings List */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">General Settings</h3>
                        <div className="space-y-2">
                            {sections.map((s, i) => (
                                <button key={i} className="w-full flex items-center justify-between p-4 bg-background rounded-xl border border-border hover:border-primary/50 hover:bg-secondary/30 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 ${s.color} rounded-lg flex items-center justify-center`}>
                                            <s.icon className="w-5 h-5" />
                                        </div>
                                        <span className="font-medium text-foreground text-sm">{s.label}</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">Theme &amp; Preference</h3>
                        <div className="p-6 bg-background rounded-xl border border-border space-y-6">

                            {/* Dark Mode Toggle Area */}
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-foreground text-sm">Theme Mode</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">Toggle light/dark appearance.</p>
                                </div>
                                <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-lg border border-border/50">
                                    <button className="p-1.5 bg-background shadow-sm rounded-md transition-colors text-foreground">
                                        <Sun className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 hover:bg-background rounded-md transition-colors text-muted-foreground hover:text-foreground">
                                        <Monitor className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 hover:bg-background rounded-md transition-colors text-muted-foreground hover:text-foreground">
                                        <Moon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-border/70 flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-foreground text-sm">Focus Sounds</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">Relaxing café sounds during sessions.</p>
                                </div>
                                {/* Custom Toggle imitation */}
                                <div className="w-12 h-6 bg-primary rounded-full p-1 relative cursor-pointer group shadow-inner">
                                    <div className="w-4 h-4 bg-primary-foreground rounded-full flex items-center justify-center transition-transform translate-x-6 shadow-sm">
                                        <CheckCircle2 className="w-2.5 h-2.5 text-primary" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subscription Summary */}
                <div className="pt-8 border-t border-border">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">Subscription</h3>
                    <div className="p-6 bg-background rounded-xl border border-border flex justify-between items-center">
                        <div>
                            <p className="font-medium text-foreground text-sm">
                                Plan:{" "}
                                <span className="font-semibold">
                                    {user?.subscription?.status === "active" ? "Pro" : "Free"}
                                </span>
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {user?.subscription?.status === "active"
                                    ? "You have unlimited AI usage and uploads."
                                    : "You have access to the free daily limits. Upgrade from any paywalled action."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Logout Action */}
            <div className="text-center">
                <button className="inline-flex items-center gap-2 px-6 py-3 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors shadow-sm bg-card">
                    <LogOut className="w-4 h-4" /> Sign Out from All Devices
                </button>
            </div>

        </div>
    );
}
