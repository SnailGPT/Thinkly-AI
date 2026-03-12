import { FileText, Zap, BrainCircuit, Plus, MoreHorizontal, ArrowRight, Video, BookOpen, Clock, AudioLines, FileQuestion } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    let _recentLectures: { id: string; title: string; createdAt: Date; fileUrl: string | null }[] = [];
    let lectureCount = 0;
    let flashcardCount = 0;
    let quizCount = 0;
    let usageSummary: { aiMessagesToday: number; uploadsToday: number; isPro: boolean } | null = null;

    if (userId) {
        try {
            const [lectures, counts, usage] = await Promise.all([
                prisma.lecture.findMany({
                    where: { userId },
                    orderBy: { createdAt: "desc" },
                    take: 4,
                }),
                prisma.$transaction([
                    prisma.lecture.count({ where: { userId } }),
                    prisma.flashcard.count({
                        where: { lecture: { userId } },
                    }),
                    prisma.quiz.count({
                        where: { lecture: { userId } },
                    }),
                ]),
                prisma.user.findUnique({
                    where: { id: userId },
                    include: { usage: true, subscription: true },
                }),
            ]);

            _recentLectures = lectures;
            lectureCount = counts[0];
            flashcardCount = counts[1];
            quizCount = counts[2];

            if (usage?.usage) {
                usageSummary = {
                    aiMessagesToday: usage.usage.aiMessagesToday,
                    uploadsToday: usage.usage.uploadsToday,
                    isPro: usage.subscription?.status === "active",
                };
            }
        } catch {
            console.warn("DB not fully set up or failing. Falling back to empty.");
        }
    }

    const recentLectures = _recentLectures;

    const quickActions = [
        { label: "Upload Material", desc: "Drag & drop file or YouTube link", icon: Plus, bgColor: "bg-blue-100/50", color: "text-blue-600", border: "border-blue-200", href: "/dashboard/upload" },
        { label: "Generate Flashcards", desc: "Study cards for your latest lecture", icon: Zap, bgColor: "bg-purple-100/50", color: "text-purple-600", border: "border-purple-200", href: "/dashboard/flashcards" },
        { label: "Take a Quiz", desc: "Test knowledge with an AI quiz", icon: FileQuestion, bgColor: "bg-emerald-100/50", color: "text-emerald-600", border: "border-emerald-200", href: "/dashboard/quizzes" },
        { label: "Chat with Lecture", desc: "Ask questions and get exact citations", icon: BrainCircuit, bgColor: "bg-amber-100/50", color: "text-amber-600", border: "border-amber-200", href: "/dashboard/chat" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-1">
                        Good morning, {session?.user?.name?.split(" ")[0] || "Student"} ✨
                    </h1>
                    <p className="text-gray-500 font-medium tracking-wide">
                        {lectureCount > 0
                            ? `You have ${lectureCount} processed lecture${lectureCount > 1 ? "s" : ""} ready to study.`
                            : "Upload your first lecture to start generating notes and quizzes."}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {usageSummary && (
                        <p className="text-sm shadow-sm font-semibold text-gray-600 flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200">
                            <Clock className="w-4 h-4 text-blue-500" />
                            AI messages today:&nbsp;
                            <span className="text-gray-900">
                                {usageSummary.aiMessagesToday} / {usageSummary.isPro ? "∞" : 10}
                            </span>
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Quick AI Actions */}
                    <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.02)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-bl-full opacity-60 pointer-events-none"></div>
                        <h2 className="text-lg font-bold text-gray-900 mb-5 relative z-10">AI Superpowers</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                            {quickActions.map((action, i) => (
                                <Link
                                    key={i}
                                    href={action.href}
                                    className={`flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-lg transition-all group duration-300 hover:-translate-y-0.5`}
                                >
                                    <div className={`w-11 h-11 ${action.bgColor} border ${action.border} ${action.color} rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105`}>
                                        <action.icon className="w-5 h-5" />
                                    </div>
                                    <div className="mt-0.5">
                                        <h3 className="font-bold text-[15px] text-gray-900 mb-0.5 group-hover:text-blue-600 transition-colors">{action.label}</h3>
                                        <p className="text-[13px] text-gray-500 leading-snug">{action.desc}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Recent Lectures */}
                    <section className="bg-white border border-gray-100 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.02)] overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-gray-50 bg-gray-50/50">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-purple-500" /> Recent Materials
                            </h2>
                            <Link href="/dashboard/lectures" className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                                View all <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {recentLectures.map((lecture) => (
                                <div key={lecture.id} className="flex items-center justify-between p-4 px-6 hover:bg-gray-50/80 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white shadow-sm border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 group-hover:text-blue-600 transition-colors">
                                            <Video className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm text-gray-900 group-hover:text-blue-700 transition-colors">
                                                {lecture.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-[13px] text-gray-400 font-medium mt-0.5">
                                                <span>{new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(lecture.createdAt))}</span>
                                                <span className="text-gray-300">•</span>
                                                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold">Processed</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-900 transition-colors opacity-0 group-hover:opacity-100 duration-200">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar Widgets Column */}
                <div className="space-y-6">

                    {/* Usage Limits */}
                    {usageSummary && (
                        <div className="bg-gradient-to-br from-blue-900 to-indigo-900 border border-blue-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <h3 className="font-bold text-white tracking-wide">Plan & limits</h3>
                                <Zap className="w-5 h-5 text-blue-300" />
                            </div>
                            <div className="space-y-4 relative z-10 text-sm text-blue-100">
                                <div className="flex justify-between items-end">
                                    <span className="font-semibold">AI messages today</span>
                                    <span className="font-mono">
                                        {usageSummary.aiMessagesToday} / {usageSummary.isPro ? "∞" : 10}
                                    </span>
                                </div>
                                {!usageSummary.isPro && (
                                    <Link
                                        href="/dashboard/chat"
                                        className="block w-full py-3 bg-white text-blue-900 text-sm font-bold text-center rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all mt-2"
                                    >
                                        Upgrade for unlimited usage ✨
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
