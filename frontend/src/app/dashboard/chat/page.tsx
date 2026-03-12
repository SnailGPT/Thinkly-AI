"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User as UserIcon, Loader2, Copy, RefreshCw, Archive, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "@/config/branding";
import { PaywallModal } from "@/components/PaywallModal";

type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
    loading?: boolean;
    error?: boolean;
};

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "system-1",
            role: "assistant",
            content: `Hello! I'm ${BRAND.name}, your AI Study Companion. Connect me to a lecture or ask any question about your study materials, and I'll find the exact answers you need.`
        }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [limitMessage, setLimitMessage] = useState<string | null>(null);
    const [showPaywall, setShowPaywall] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isTyping) return;
        setLimitMessage(null);

        const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        const aiMsgId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, { id: aiMsgId, role: "assistant", content: "", loading: true }]);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: userMsg.content }),
            });

            if (res.status === 402) {
                const json = await res.json();
                const msg =
                    json.reason === "limit_ai"
                        ? "You’ve reached today’s free AI message limit."
                        : "Your current plan limit has been reached.";
                setLimitMessage(msg);
                setShowPaywall(true);
                setMessages(prev =>
                    prev.map(m =>
                        m.id === aiMsgId
                            ? {
                                ...m,
                                content: msg,
                                loading: false,
                                error: true,
                            }
                            : m,
                    ),
                );
                return;
            }

            if (!res.ok) {
                const text = await res.text();
                setMessages(prev =>
                    prev.map(m =>
                        m.id === aiMsgId
                            ? {
                                ...m,
                                content: text || "Something went wrong while contacting the AI.",
                                loading: false,
                                error: true,
                            }
                            : m,
                    ),
                );
                return;
            }

            const json = await res.json();
            setMessages(prev =>
                prev.map(m =>
                    m.id === aiMsgId
                        ? { ...m, content: json.answer ?? "", loading: false }
                        : m,
                ),
            );
        } catch (err) {
            console.error(err);
            setMessages(prev =>
                prev.map(m =>
                    m.id === aiMsgId
                        ? {
                            ...m,
                            content: "Network error while contacting the AI.",
                            loading: false,
                            error: true,
                        }
                        : m,
                ),
            );
        } finally {
            setIsTyping(false);
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        // Optional: Trigger a toast
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4 shrink-0">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 mb-1">Knowledge Chat</h1>
                    <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Connected to your 14 lectures
                    </p>
                </div>
                <button
                    onClick={() => setMessages([messages[0]])}
                    className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 bg-white border border-gray-200 hover:border-blue-200 px-4 py-2 rounded-xl transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" /> New Chat
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto hide-scrollbar space-y-6 pb-6 pr-4">
                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-4 ${msg.role === "assistant" ? "" : "flex-row-reverse"}`}
                        >
                            {/* Avatar */}
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${msg.role === "assistant" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                                {msg.role === "assistant" ? <Bot className="w-6 h-6" /> : <UserIcon className="w-6 h-6" />}
                            </div>

                            {/* Bubble */}
                            <div className={`group flex flex-col gap-1 max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                                <div className={`relative px-6 py-4 text-[15px] leading-relaxed shadow-sm ${msg.role === "user"
                                        ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm"
                                        : "bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm"
                                    }`}>
                                    {msg.loading ? (
                                        <div className="flex gap-1.5 items-center h-5">
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                        </div>
                                    ) : (
                                        <p className={msg.error ? "text-red-500" : undefined}>{msg.content}</p>
                                    )}
                                </div>

                                {/* Actions (Assistant Only) */}
                                {msg.role === "assistant" && !msg.loading && (
                                    <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleCopy(msg.content)} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-white rounded-md transition-colors" title="Copy">
                                            <Copy className="w-3.5 h-3.5" />
                                        </button>
                                        <button className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-white rounded-md transition-colors" title="Regenerate">
                                            <RefreshCw className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={bottomRef} className="h-4" />
            </div>

            {/* Input Area */}
            <div className="pt-4 shrink-0 max-w-4xl mx-auto w-full">
                <form
                    onSubmit={handleSend}
                    className="relative bg-white border border-gray-200 rounded-[1.5rem] shadow-sm focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-400 transition-all flex items-end p-2 gap-2"
                >
                    <button type="button" className="p-3 text-gray-400 hover:text-blue-600 transition-colors shrink-0" title="Attach Material">
                        <Archive className="w-5 h-5" />
                    </button>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Ask anything about your lectures..."
                        className="w-full max-h-32 min-h-[44px] py-3 bg-transparent border-none outline-none resize-none hide-scrollbar text-gray-900 placeholder:text-gray-400 text-base"
                        rows={1}
                        disabled={isTyping}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:bg-gray-200 disabled:text-gray-400 transition-all shrink-0 shadow-sm"
                    >
                        {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </form>
                <div className="mt-3 space-y-1">
                    {limitMessage && (
                        <p className="text-center text-xs text-red-500 font-medium">
                            {limitMessage}
                        </p>
                    )}
                    <p className="text-center text-xs text-gray-400 font-medium">
                        AI can make mistakes. Consider verifying important information from source lectures.
                    </p>
                </div>
            </div>

            <PaywallModal open={showPaywall} onOpenChange={setShowPaywall} />
        </div>
    );
}
