"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
    BookOpen, Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, Sparkles, BookMarked, PenLine, Coffee
} from "lucide-react";
import { BRAND } from "@/config/branding";

/* ─── floating icons config ───────────────────────────── */
const FLOATING_ICONS = [
    { icon: Coffee, x: "10%", y: "15%", size: 28, delay: 0, dur: 6 },
    { icon: BookOpen, x: "75%", y: "10%", size: 32, delay: 0.8, dur: 7 },
    { icon: Sparkles, x: "85%", y: "55%", size: 22, delay: 1.5, dur: 5 },
    { icon: BookMarked, x: "8%", y: "70%", size: 26, delay: 0.4, dur: 8 },
    { icon: PenLine, x: "60%", y: "80%", size: 20, delay: 1.2, dur: 6.5 },
    { icon: Coffee, x: "40%", y: "5%", size: 18, delay: 2, dur: 7 },
];

/* ─── input field with floating label ─────────────────── */
interface FloatInputProps {
    id: string;
    label: string;
    type?: string;
    value: string;
    onChange: (v: string) => void;
    error?: string;
    icon: React.ReactNode;
    rightElement?: React.ReactNode;
    autoComplete?: string;
}

function FloatInput({
    id, label, type = "text", value, onChange, error, icon, rightElement, autoComplete,
}: FloatInputProps) {
    const [focused, setFocused] = useState(false);
    const lifted = focused || value.length > 0;

    return (
        <div className="relative">
            <div
                className={`relative flex items-center border rounded-[14px] transition-all duration-200 bg-white
          ${error
                        ? "border-red-400 ring-2 ring-red-200"
                        : lifted
                            ? "border-blue-500 ring-2 ring-blue-500/20"
                            : "border-gray-200 hover:border-blue-500/50"
                    }`}
            >
                <span
                    className={`absolute left-4 transition-colors duration-200
            ${lifted ? "text-blue-500" : "text-gray-400"}`}
                >
                    {icon}
                </span>

                <input
                    id={id}
                    type={type}
                    value={value}
                    autoComplete={autoComplete}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    aria-label={label}
                    aria-describedby={error ? `${id}-error` : undefined}
                    aria-invalid={!!error}
                    className="w-full pl-11 pr-12 pt-6 pb-2 bg-transparent outline-none text-gray-900 text-sm font-medium placeholder-transparent rounded-[14px]"
                    placeholder={label}
                />

                <label
                    htmlFor={id}
                    className={`absolute left-11 font-medium transition-all duration-200 pointer-events-none select-none
            ${lifted
                            ? "top-2 text-[10px] text-blue-500 tracking-wide uppercase"
                            : "top-1/2 -translate-y-1/2 text-sm text-gray-400"
                        }`}
                >
                    {label}
                </label>

                {rightElement && (
                    <span className="absolute right-4 flex items-center">{rightElement}</span>
                )}
            </div>

            <AnimatePresence>
                {error && (
                    <motion.p
                        id={`${id}-error`}
                        role="alert"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-1 mt-1.5 ml-1 text-xs text-red-500 font-medium"
                    >
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function SignupPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = useCallback(() => {
        const e: Record<string, string> = {};
        if (!name.trim()) e.name = "Full name is required.";
        if (!email.trim()) e.email = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Please enter a valid email address.";
        if (!password) e.password = "Password is required.";
        else if (password.length < 8) e.password = "Password must be at least 8 characters.";
        if (!confirm) e.confirm = "Please confirm your password.";
        else if (password !== confirm) e.confirm = "Passwords do not match.";
        if (!agreed) e.agreed = "You must agree to the Terms of Service.";
        return e;
    }, [name, email, password, confirm, agreed]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setErrors({});
        setLoading(true);

        try {
            await axios.post("/api/auth/register", { name, email, password });

            const result = await signIn("credentials", {
                redirect: false,
                email,
                password
            });

            if (result?.error) {
                setErrors({ form: "Error auto-logging in after registration." });
            } else {
                router.push("/dashboard");
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response?.status === 400) {
                setErrors({ email: "Account format invalid or already exists." });
            } else {
                setErrors({ form: "Something went wrong. Please try again." });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-50 overflow-hidden font-sans">
            <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="hidden lg:flex lg:w-[50%] relative flex-col items-center justify-center overflow-hidden"
                style={{
                    background: `linear-gradient(135deg, hsl(220, 80%, 45%) 0%, hsl(280, 80%, 55%) 100%)`,
                }}
            >
                <div
                    className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"
                />
                {FLOATING_ICONS.map(({ icon: Icon, x, y, size, delay, dur }, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-white/30"
                        style={{ left: x, top: y }}
                        animate={{ y: [0, -14, 0] }}
                        transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Icon size={size} />
                    </motion.div>
                ))}

                <div className="relative z-10 text-center px-12 max-w-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="inline-flex items-center gap-3 mb-10"
                    >
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
                            <BookOpen className="text-white w-6 h-6" />
                        </div>
                        <span className="text-white text-2xl font-bold tracking-tight">{BRAND.name}</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="text-white text-4xl font-bold leading-tight mb-5"
                    >
                        Create your account
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55, duration: 0.5 }}
                        className="text-white/80 text-base leading-relaxed"
                    >
                        Join thousands of students who transform their lectures into notes instantly.
                    </motion.p>
                </div>
            </motion.div>

            <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-16 relative overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full max-w-[440px] py-12"
                >
                    <div className="mb-8">
                        <h1 className="text-gray-900 text-3xl font-bold tracking-tight">Create an account</h1>
                        <p className="text-gray-500 mt-2 text-sm">Start your premium study journey today.</p>
                    </div>

                    <AnimatePresence>
                        {errors.form && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5"
                                role="alert"
                            >
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {errors.form}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        <FloatInput
                            id="signup-name"
                            label="Full name"
                            type="text"
                            value={name}
                            onChange={(v) => { setName(v); setErrors((p) => ({ ...p, name: undefined as unknown as string })); }}
                            error={errors.name}
                            icon={<User className="w-5 h-5" />}
                        />
                        <FloatInput
                            id="signup-email"
                            label="Email address"
                            type="email"
                            value={email}
                            onChange={(v) => { setEmail(v); setErrors((p) => ({ ...p, email: undefined as unknown as string })); }}
                            error={errors.email}
                            icon={<Mail className="w-5 h-5" />}
                        />
                        <FloatInput
                            id="signup-password"
                            label="Password"
                            type={showPw ? "text" : "password"}
                            value={password}
                            onChange={(v) => { setPassword(v); setErrors((p) => ({ ...p, password: undefined as unknown as string })); }}
                            error={errors.password}
                            icon={<Lock className="w-5 h-5" />}
                            rightElement={
                                <button
                                    type="button"
                                    onClick={() => setShowPw((s) => !s)}
                                    className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                                >
                                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            }
                        />
                        <FloatInput
                            id="signup-confirm"
                            label="Confirm password"
                            type="password"
                            value={confirm}
                            onChange={(v) => { setConfirm(v); setErrors((p) => ({ ...p, confirm: undefined as unknown as string })); }}
                            error={errors.confirm}
                            icon={<Lock className="w-5 h-5" />}
                        />

                        <div className="pt-2">
                            <label className="flex items-start gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={(e) => { setAgreed(e.target.checked); setErrors((p) => ({ ...p, agreed: "" })); }}
                                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-600 font-medium">
                                    I agree to the <Link href="#" className="text-blue-600 hover:underline">Terms of Service</Link>
                                </span>
                            </label>
                            {errors.agreed && (
                                <p className="flex items-center gap-1 mt-1.5 ml-1 text-xs text-red-500 font-medium">
                                    <AlertCircle className="w-3 h-3" /> {errors.agreed}
                                </p>
                            )}
                        </div>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={!loading ? { scale: 1.015, y: -1 } : {}}
                            whileTap={!loading ? { scale: 0.975 } : {}}
                            className="w-full mt-4 py-3.5 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:bg-blue-700 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Creating account…</span>
                                </>
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-600 font-semibold hover:underline">
                            Sign in
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
