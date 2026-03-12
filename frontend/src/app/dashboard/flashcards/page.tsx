"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Zap, ArrowLeft, ArrowRight, RotateCw, Check, FileText } from "lucide-react";
import Link from "next/link";

type LatestLectureResponse = {
    lecture: {
        id: string;
        title: string;
        flashcards: { id: string; front: string; back: string }[];
    } | null;
};

export default function FlashcardsPage() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [viewMode, setViewMode] = useState<"study" | "list">("study");
    const [cards, setCards] = useState<LatestLectureResponse["lecture"] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/lectures/latest");
                if (!res.ok) throw new Error("Failed to load flashcards");
                const json: LatestLectureResponse = await res.json();
                setCards(json.lecture);
            } catch (e) {
                console.error(e);
                setError("Unable to load flashcards for your latest lecture.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const deck = cards?.flashcards ?? [];
    const currentCard = deck[currentIndex];

    const nextCard = () => {
        if (!deck.length) return;
        setIsFlipped(false);
        setTimeout(() => setCurrentIndex((prev) => (prev + 1) % deck.length), 150);
    };

    const prevCard = () => {
        if (!deck.length) return;
        setIsFlipped(false);
        setTimeout(() => setCurrentIndex((prev) => (prev === 0 ? deck.length - 1 : prev - 1)), 150);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-1 flex items-center gap-3">
                        <Zap className="w-8 h-8 text-purple-500" /> Study Flashcards
                    </h1>
                    <p className="text-gray-500 font-medium tracking-wide">Review auto-generated flashcards using spaced repetition.</p>
                </div>
                <div className="flex items-center gap-3 bg-gray-100 p-1 rounded-[1rem]">
                    <button
                        onClick={() => setViewMode("study")}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === "study" ? "bg-white shadow-sm text-purple-600" : "text-gray-500 hover:text-gray-900"}`}
                    >
                        Study Mode
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === "list" ? "bg-white shadow-sm text-purple-600" : "text-gray-500 hover:text-gray-900"}`}
                    >
                        List View
                    </button>
                </div>
            </div>

            {viewMode === "study" ? (
                <div className="max-w-2xl mx-auto mt-12 flex flex-col items-center">
                    {/* Progress */}
                    <div className="w-full flex justify-between items-center mb-6 px-2">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest px-3 py-1 bg-white border border-gray-100 shadow-sm rounded-lg">
                            {deck.length ? (
                                <>Card {currentIndex + 1} of {deck.length}</>
                            ) : (
                                "No cards yet"
                            )}
                        </span>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
                        </div>
                    </div>

                    {/* Flashcard Component */}
                    <div
                        className="relative w-full aspect-[4/3] sm:aspect-[3/2] perspective-1000 cursor-pointer group"
                        onClick={() => deck.length && setIsFlipped(!isFlipped)}
                    >
                        <motion.div
                            className="w-full h-full relative preserve-3d"
                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                            transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                        >
                            {/* Front */}
                            <div className="absolute inset-0 backface-hidden bg-white border border-gray-100 rounded-[2.5rem] shadow-xl p-8 sm:p-12 flex flex-col items-center justify-center text-center">
                                <div className="absolute top-6 left-6 text-gray-300">
                                    <FileText className="w-8 h-8 opacity-50" />
                                </div>
                                {loading && (
                                    <h2 className="text-sm text-gray-500">Loading flashcards…</h2>
                                )}
                                {!loading && error && (
                                    <h2 className="text-sm text-red-500">{error}</h2>
                                )}
                                {!loading && !error && !deck.length && (
                                    <h2 className="text-sm text-gray-500 text-center max-w-xs">
                                        No flashcards yet. Upload a lecture and let Thinkly generate cards automatically.
                                    </h2>
                                )}
                                {!loading && !error && deck.length > 0 && (
                                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                                        {currentCard.front}
                                    </h2>
                                )}
                                <div className="absolute bottom-8 text-gray-400 text-sm font-medium flex items-center gap-2">
                                    <RotateCw className="w-4 h-4 group-hover:animate-spin" /> Click to flip
                                </div>
                            </div>

                            {/* Back */}
                            <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-purple-500 to-indigo-600 rounded-[2.5rem] shadow-xl p-8 sm:p-12 flex flex-col items-center justify-center text-center text-white" style={{ transform: "rotateY(180deg)" }}>
                                <div className="absolute top-6 left-6 text-white/20">
                                    <Check className="w-8 h-8 opacity-50" />
                                </div>
                                <p className="text-xl sm:text-2xl font-semibold leading-relaxed">
                                    {currentCard.back}
                                </p>
                                {deck.length > 0 && (
                                    <div className="absolute bottom-6 flex gap-3">
                                    <button className="bg-red-500/80 hover:bg-red-500 border border-white/20 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors">Hard</button>
                                    <button className="bg-amber-500/80 hover:bg-amber-500 border border-white/20 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors">Good</button>
                                    <button className="bg-emerald-500/80 hover:bg-emerald-500 border border-white/20 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors">Easy</button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-6 mt-12 w-full justify-center">
                        <button
                            onClick={prevCard}
                            className="p-4 bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition-all group"
                        >
                            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => setIsFlipped(!isFlipped)}
                            className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-lg shadow-gray-900/20 hover:bg-gray-800 transition-colors"
                        >
                            Flip Card
                        </button>
                        <button
                            onClick={nextCard}
                            className="p-4 bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition-all group"
                        >
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Add new card */}
                    <Link href="/dashboard/upload" className="h-64 rounded-3xl border-2 border-dashed border-gray-200 hover:border-purple-400 bg-gray-50 hover:bg-white flex flex-col items-center justify-center transition-all group cursor-pointer shadow-sm relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="w-16 h-16 bg-white border border-purple-100 text-purple-600 rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                            <Zap className="w-8 h-8" />
                        </div>
                        <span className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">Generate Flashcards</span>
                        <span className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-semibold">From Uploaded Lecture</span>
                    </Link>

                    {deck.map((card, i) => (
                        <div key={i} className="h-64 bg-white border border-gray-100 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden relative">
                            <div className="text-[10px] font-black uppercase tracking-widest text-purple-600 mb-3 bg-purple-50 inline-block px-3 py-1 rounded-full w-max border border-purple-100">
                                Card {i + 1}
                            </div>
                            <h3 className="font-bold text-gray-900 leading-tight mb-2 line-clamp-3 flex-1">
                                Q: {card.front}
                            </h3>
                            <div className="pt-4 border-t border-gray-50">
                                <p className="text-sm text-gray-500 line-clamp-2">
                                    <span className="font-semibold text-gray-400 uppercase text-[10px] tracking-widest mr-1">A:</span> {card.back}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
