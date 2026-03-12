"use client";

import { useState } from "react";
import { Upload, Youtube, ArrowRight, Loader2, Link as LinkIcon, CheckCircle2, Circle, Sparkles, Video, FileAudio, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type UploadState = "idle" | "processing" | "queued" | "done" | "error" | "limited";

export default function UploadPage() {
    const [uploadState, setUploadState] = useState<UploadState>("idle");
    const [progress, setProgress] = useState(0);
    const [activeStep, setActiveStep] = useState(0);
    const [fileName, setFileName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [lectureId, setLectureId] = useState<string | null>(null);

    const steps = [
        "Uploading file",
        "Extracting text",
        "Queuing AI job",
        "Summarizing lecture",
        "Generating notes & flashcards",
        "Creating quizzes",
    ];

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setFileName(file.name);
        await startUpload({ file });
    }

    async function startUpload({ file, text }: { file?: File; text?: string }) {
        setError(null);
        setUploadState("processing");
        setProgress(10);
        setActiveStep(0);

        try {
            const form = new FormData();
            if (file) form.append("file", file);
            if (text) form.append("text", text);
            form.append("title", file?.name || "Lecture");

            const res = await fetch("/api/lectures/upload", {
                method: "POST",
                body: form,
            });

            if (res.status === 402) {
                const json = await res.json();
                setUploadState("limited");
                setError(
                    json.reason === "limit_uploads"
                        ? "Daily upload limit reached. Upgrade to Pro or wait until tomorrow."
                        : "Plan limit reached.",
                );
                return;
            }

            if (!res.ok) {
                const textBody = await res.text();
                setUploadState("error");
                setError(textBody || "Upload failed. Please try again.");
                return;
            }

            const json = await res.json();
            setLectureId(json.lectureId);
            setActiveStep(2);
            setProgress(60);
            setUploadState("queued");
            setTimeout(() => {
                setActiveStep(5);
                setProgress(100);
                setUploadState("done");
            }, 2000);
        } catch (e) {
            console.error(e);
            setUploadState("error");
            setError("Unexpected error. Please try again.");
        }
    }

    async function handleYoutubeSubmit() {
        if (!youtubeUrl.trim()) return;
        setFileName("YouTube lecture");
        await startUpload({ text: youtubeUrl });
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 pb-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Upload Material</h1>
                <p className="text-muted-foreground">
                    Upload your lecture, document, or paste a YouTube link to generate notes, flashcards, quizzes, and a searchable knowledge base.
                </p>
            </div>

            <AnimatePresence mode="wait">
                {(uploadState === "idle" || uploadState === "error" || uploadState === "limited") && (
                    <motion.div
                        key="upload-form"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        <div className="bg-card border-2 border-dashed border-border/60 hover:border-primary/50 hover:bg-secondary/30 rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer group shadow-sm min-h-[300px]">
                            <div className="w-16 h-16 bg-background border border-border rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 transition-transform">
                                <Upload className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="font-semibold text-foreground text-lg mb-2">Click or drag file to upload</h3>
                            <p className="text-sm text-muted-foreground mb-6 max-w-[260px]">
                                Supported: PDF, TXT, DOCX, MP3, MP4. Max 200MB per upload.
                            </p>

                            <div className="flex gap-4 mb-4">
                                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-background border border-border px-2.5 py-1 rounded-md">
                                    <Video className="w-3.5 h-3.5" /> MP4
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-background border border-border px-2.5 py-1 rounded-md">
                                    <FileAudio className="w-3.5 h-3.5" /> MP3
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-background border border-border px-2.5 py-1 rounded-md">
                                    <FileText className="w-3.5 h-3.5" /> PDF / TXT
                                </div>
                            </div>

                            <input
                                type="file"
                                accept=".pdf,.txt,.docx,.mp3,.mp4,audio/*,video/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                            />

                            {error && (
                                <p className="mt-4 text-xs text-red-500 font-medium max-w-xs">
                                    {error}
                                </p>
                            )}
                        </div>

                        <div className="bg-card border border-border rounded-2xl p-8 flex flex-col justify-between shadow-sm min-h-[300px]">
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                                        <Youtube className="text-red-500 w-5 h-5" />
                                    </div>
                                    <h3 className="font-semibold text-foreground text-lg">YouTube Link</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-6">
                                    Paste a public YouTube URL. Thinkly will fetch the transcript where available and run the full AI pipeline.
                                </p>

                                <div className="space-y-3">
                                    <div className="relative flex items-center">
                                        <LinkIcon className="absolute left-3 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="text"
                                            value={youtubeUrl}
                                            onChange={(e) => setYoutubeUrl(e.target.value)}
                                            placeholder="https://youtube.com/watch?v=..."
                                            className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleYoutubeSubmit}
                                disabled={!youtubeUrl.trim() || uploadState === "processing"}
                                className="w-full py-3 bg-foreground text-background rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-foreground/90 disabled:opacity-50 transition-colors mt-6"
                            >
                                Process Video <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {(uploadState === "processing" || uploadState === "queued" || uploadState === "done") && (
                    <motion.div
                        key="upload-progress"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card border border-border rounded-2xl p-8 shadow-sm"
                    >
                        <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                                        uploadState === "done"
                                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                                            : "bg-primary/10 border-primary/20 text-primary"
                                    }`}
                                >
                                    {uploadState === "done" ? (
                                        <CheckCircle2 className="w-6 h-6" />
                                    ) : (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground text-lg">
                                        {fileName || "Processing lecture"}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-0.5">
                                        {uploadState === "queued"
                                            ? "Upload complete. Your AI pipeline is queued—this usually takes under a minute."
                                            : uploadState === "done"
                                            ? "Processing complete. You can review notes, flashcards, quizzes, and start chatting with this lecture."
                                            : "Uploading and preparing your material…"}
                                    </p>
                                </div>
                            </div>
                            <span className="text-2xl font-bold tabular-nums text-foreground">{progress}%</span>
                        </div>

                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mb-8">
                            <motion.div
                                className={`h-full ${uploadState === "done" ? "bg-emerald-500" : "bg-primary"}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ ease: "linear" }}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4 p-6 bg-background rounded-xl border border-border/50">
                            {steps.map((step, index) => {
                                let status: "pending" | "active" | "complete" = "pending";
                                if (uploadState === "done" || index < activeStep) status = "complete";
                                if ((uploadState === "processing" || uploadState === "queued") && index === activeStep)
                                    status = "active";

                                return (
                                    <div key={index} className="flex items-center gap-3">
                                        {status === "complete" && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                                        {status === "active" && (
                                            <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />
                                        )}
                                        {status === "pending" && (
                                            <Circle className="w-5 h-5 text-muted-foreground/30 shrink-0" />
                                        )}

                                        <span
                                            className={`text-sm font-medium ${
                                                status === "complete"
                                                    ? "text-foreground"
                                                    : status === "active"
                                                    ? "text-primary"
                                                    : "text-muted-foreground"
                                            }`}
                                        >
                                            {step}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {uploadState === "done" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-8 flex justify-end"
                            >
                                <button
                                    onClick={() => {
                                        if (lectureId) {
                                            window.location.href = `/dashboard/lectures/${lectureId}`;
                                        } else {
                                            window.location.href = "/dashboard";
                                        }
                                    }}
                                    className="py-2.5 px-6 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
                                >
                                    <Sparkles className="w-4 h-4" /> View Workspace
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

