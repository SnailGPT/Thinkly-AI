"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X, Zap, Crown } from "lucide-react";
import { useState } from "react";

export function PaywallModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
    const [loading, setLoading] = useState(false);

    const handleUpgrade = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/billing/checkout", { method: "POST" });
            if (!res.ok) {
                setLoading(false);
                return;
            }
            const json = await res.json();
            if (json.url) {
                window.location.href = json.url;
            } else {
                setLoading(false);
            }
        } catch {
            setLoading(false);
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
                <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-200 p-6 relative">
                        <button
                            onClick={() => onOpenChange(false)}
                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg">
                                <Crown className="w-5 h-5" />
                            </div>
                            <Dialog.Title className="text-lg font-bold text-gray-900">
                                Upgrade to Thinkly Pro
                            </Dialog.Title>
                        </div>
                        <Dialog.Description className="text-sm text-gray-500 mb-4">
                            You&apos;ve reached today&apos;s free plan limits. Unlock unlimited AI questions, uploads, and
                            priority processing for just <span className="font-semibold text-gray-900">$10/month</span>.
                        </Dialog.Description>

                        <ul className="text-sm text-gray-700 space-y-2 mb-5">
                            <li className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                                    ✓
                                </span>
                                Unlimited lecture uploads
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                                    ✓
                                </span>
                                Unlimited AI chat messages
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                                    ✓
                                </span>
                                Priority processing on AI pipelines
                            </li>
                        </ul>

                        <div className="flex gap-3">
                            <button
                                onClick={handleUpgrade}
                                disabled={loading}
                                className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-60"
                            >
                                <Zap className="w-4 h-4" />
                                {loading ? "Redirecting…" : "Upgrade for $10/month"}
                            </button>
                            <button
                                onClick={() => onOpenChange(false)}
                                className="px-4 py-3 text-sm font-medium text-gray-500 hover:text-gray-800 rounded-xl border border-gray-200 bg-white"
                            >
                                Maybe later
                            </button>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

