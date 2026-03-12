"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Upload, FileText, Zap, BrainCircuit, Search, Settings, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    return (
        <AnimatePresence>
            {open && (
                <React.Fragment>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 transition-opacity"
                    />
                    <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="w-full max-w-xl pointer-events-auto"
                        >
                            <Command className="flex flex-col overflow-hidden rounded-xl bg-card border border-border shadow-2xl">
                                <div className="flex items-center border-b border-border px-3">
                                    <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                                    <Command.Input
                                        placeholder="Type a command or search..."
                                        className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                                        autoFocus
                                    />
                                </div>
                                <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
                                    <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                                        No results found.
                                    </Command.Empty>

                                    <Command.Group heading="Quick Actions" className="px-2 text-xs font-semibold text-muted-foreground mb-2 mt-2">
                                        <Command.Item
                                            onSelect={() => runCommand(() => router.push("/dashboard/upload"))}
                                            className="flex cursor-pointer items-center rounded-md px-2 py-2 text-sm hover:bg-secondary aria-selected:bg-secondary text-foreground"
                                        >
                                            <Upload className="mr-2 h-4 w-4" />
                                            <span>Upload Lecture</span>
                                            <span className="ml-auto text-xs text-muted-foreground">⌘ U</span>
                                        </Command.Item>
                                        <Command.Item
                                            onSelect={() => runCommand(() => router.push("/dashboard/notes"))}
                                            className="flex cursor-pointer items-center rounded-md px-2 py-2 text-sm hover:bg-secondary aria-selected:bg-secondary text-foreground"
                                        >
                                            <FileText className="mr-2 h-4 w-4" />
                                            <span>Generate Notes</span>
                                        </Command.Item>
                                        <Command.Item
                                            onSelect={() => runCommand(() => router.push("/dashboard/flashcards"))}
                                            className="flex cursor-pointer items-center rounded-md px-2 py-2 text-sm hover:bg-secondary aria-selected:bg-secondary text-foreground"
                                        >
                                            <Zap className="mr-2 h-4 w-4" />
                                            <span>Generate Flashcards</span>
                                        </Command.Item>
                                        <Command.Item
                                            onSelect={() => runCommand(() => router.push("/dashboard/quizzes"))}
                                            className="flex cursor-pointer items-center rounded-md px-2 py-2 text-sm hover:bg-secondary aria-selected:bg-secondary text-foreground"
                                        >
                                            <BrainCircuit className="mr-2 h-4 w-4" />
                                            <span>Generate Quiz</span>
                                        </Command.Item>
                                    </Command.Group>

                                    <Command.Separator className="h-px bg-border my-2" />

                                    <Command.Group heading="Navigation" className="px-2 text-xs font-semibold text-muted-foreground mb-2">
                                        <Command.Item
                                            onSelect={() => runCommand(() => router.push("/dashboard"))}
                                            className="flex cursor-pointer items-center rounded-md px-2 py-2 text-sm hover:bg-secondary aria-selected:bg-secondary text-foreground"
                                        >
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            <span>Go to Dashboard</span>
                                        </Command.Item>
                                        <Command.Item
                                            onSelect={() => runCommand(() => router.push("/dashboard/settings"))}
                                            className="flex cursor-pointer items-center rounded-md px-2 py-2 text-sm hover:bg-secondary aria-selected:bg-secondary text-foreground"
                                        >
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Settings</span>
                                        </Command.Item>
                                    </Command.Group>
                                </Command.List>
                            </Command>
                        </motion.div>
                    </div>
                </React.Fragment>
            )}
        </AnimatePresence>
    );
}
