"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, XCircle, RefreshCw, Layers, BrainCircuit } from "lucide-react";
import Link from "next/link";

type LatestLectureResponse = {
    lecture: {
        id: string;
        title: string;
        quizzes: {
            id: string;
            question: string;
            options: string[];
            correctOption: number;
            explanation: string | null;
        }[];
    } | null;
};

export default function QuizzesPage() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [lecture, setLecture] = useState<LatestLectureResponse["lecture"]>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/lectures/latest");
                if (!res.ok) throw new Error("Failed to load quiz");
                const json: LatestLectureResponse = await res.json();
                setLecture(json.lecture);
            } catch (e) {
                console.error(e);
                setError("Unable to load quiz for your latest lecture.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const questions = lecture?.quizzes ?? [];
    const question = questions[currentQuestion];

    const handleSelectOption = (index: number) => {
        if (showResult) return;
        setSelectedOption(index);
    };

    const handleSubmit = () => {
        if (selectedOption === null) return;
        setShowResult(true);
        if (question && selectedOption === question.correctOption) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setSelectedOption(null);
            setShowResult(false);
        } else {
            // End of quiz logic could go here
            console.log("Quiz completed!");
        }
    };

    const isFinished = questions.length > 0 && showResult && currentQuestion === questions.length - 1;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10 max-w-4xl mx-auto">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4 border-b border-gray-100 pb-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-lg mb-3 border border-emerald-100/50 shadow-sm">
                        <Layers className="w-3.5 h-3.5" />
                        {lecture?.title ?? "Latest lecture"}
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-1 flex items-center gap-3">
                        {lecture?.title ?? "AI Quiz"}
                    </h1>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Score</span>
                    <span className="text-xl font-black text-gray-900 leading-none">
                        {score}
                        <span className="text-gray-400">/{questions.length || 0}</span>
                    </span>
                </div>
            </div>

            {!isFinished ? (
                <div className="bg-white border border-gray-100 rounded-[2rem] shadow-sm p-6 sm:p-10 relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gray-50">
                        <motion.div
                            className="h-full bg-emerald-500 transition-all duration-300"
                            style={{ width: questions.length ? `${((currentQuestion + 1) / questions.length) * 100}%` : "0%" }}
                        />
                    </div>

                    <div className="mb-8 mt-2 flex justify-between items-center text-sm font-bold text-gray-400 tracking-widest uppercase">
                        {questions.length ? (
                            <>Question {currentQuestion + 1} of {questions.length}</>
                        ) : (
                            "No questions yet"
                        )}
                        <BrainCircuit className="w-5 h-5 opacity-50 text-emerald-500" />
                    </div>

                    {!questions.length && (
                        <p className="text-sm text-gray-500">
                            No quiz has been generated yet. Upload a lecture and wait for processing to complete to take a quiz.
                        </p>
                    )}

                    {questions.length > 0 && (
                        <>
                            <h2 className="text-2xl font-bold text-gray-900 mb-8 leading-relaxed">
                                {question.question}
                            </h2>

                            <div className="space-y-4">
                                {question.options.map((option, idx) => {
                            const isSelected = selectedOption === idx;
                            const isCorrect = idx === question.correctOption;

                            let borderClass = "border-gray-200 hover:border-gray-300 hover:bg-gray-50";
                            let icon = <div className="w-5 h-5 rounded-full border-2 border-gray-300 mr-4 shrink-0 transition-colors group-hover:border-blue-400"></div>;

                            if (showResult) {
                                if (isCorrect) {
                                    borderClass = "border-emerald-500 bg-emerald-50 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
                                    icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-4 shrink-0" />;
                                } else if (isSelected && !isCorrect) {
                                    borderClass = "border-red-400 bg-red-50";
                                    icon = <XCircle className="w-5 h-5 text-red-500 mr-4 shrink-0" />;
                                } else {
                                    borderClass = "border-gray-100 bg-gray-50/50 opacity-50 cursor-not-allowed";
                                    icon = <div className="w-5 h-5 rounded-full border-2 border-gray-200 mr-4 shrink-0"></div>;
                                }
                            } else if (isSelected) {
                                borderClass = "border-blue-500 bg-blue-50 shadow-sm ring-2 ring-blue-500/10";
                                icon = (
                                    <div className="w-5 h-5 rounded-full border-[6px] border-blue-500 bg-white mr-4 shrink-0 transition-all shadow-[0_0_10px_rgba(59,130,246,0.3)]"></div>
                                );
                            }

                                    return (
                                <button
                                    key={idx}
                                    onClick={() => handleSelectOption(idx)}
                                    disabled={showResult}
                                    className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 flex items-center group font-medium text-gray-800 text-[15px] ${borderClass}`}
                                >
                                    {icon}
                                    <span className={showResult && isCorrect ? "font-bold text-emerald-900" : ""}>{option}</span>
                                </button>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    <AnimatePresence>
                        {showResult && question && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: "auto", marginTop: 32 }}
                                className="overflow-hidden"
                            >
                                <div className={`p-6 rounded-2xl border ${selectedOption === question.correctOption ? "bg-emerald-50/50 border-emerald-100" : "bg-red-50/50 border-red-100"}`}>
                                    <div className="flex gap-4">
                                        <div className="shrink-0 mt-1">
                                            {selectedOption === question.correctOption ? (
                                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                                                    <XCircle className="w-5 h-5" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className={`font-bold text-sm mb-1 uppercase tracking-widest ${selectedOption === question.correctOption ? 'text-emerald-800' : 'text-red-800'}`}>
                                                {selectedOption === question.correctOption ? "Outstanding!" : "Not quite."}
                                            </h4>
                                            <p className="text-gray-700 text-[15px] leading-relaxed">
                                                {question.explanation}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-8 flex justify-end">
                        {!showResult ? (
                            <button
                                onClick={handleSubmit}
                                disabled={selectedOption === null}
                                className="px-8 py-3.5 bg-gray-900 text-white font-bold rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:bg-gray-800 disabled:opacity-50 disabled:shadow-none transition-all w-full sm:w-auto text-center"
                            >
                                Submit Answer
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                className="px-8 py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-[0_4px_14px_rgba(59,130,246,0.3)] hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                            >
                                {isFinished ? "Finish Quiz" : "Next Question"} <ArrowRight className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border border-gray-100 rounded-[2rem] shadow-sm p-12 text-center max-w-2xl mx-auto flex flex-col items-center">
                    <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 border-8 border-emerald-50/50 shadow-inner">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Quiz Completed!</h2>
                    <p className="text-gray-500 font-medium mb-8">You scored <span className="font-bold text-gray-900">{score}</span> out of {questions.length}.</p>

                    <div className="flex gap-4 w-full">
                        <button onClick={() => { setCurrentQuestion(0); setScore(0); setShowResult(false); setSelectedOption(null) }} className="flex-1 py-4 bg-gray-50 hover:bg-gray-100 text-gray-900 font-bold border border-gray-200 rounded-xl transition-colors flex justify-center items-center gap-2">
                            <RefreshCw className="w-4 h-4" /> Retake
                        </button>
                        <Link href="/dashboard" className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-[0_4px_20px_rgba(59,130,246,0.3)] transition-colors flex justify-center items-center gap-2">
                            Back to Dashboard <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
