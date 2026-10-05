"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { Bot, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";

type AuthMode = "login" | "register";

export default function AuthForm() {
    const { login } = useAuth();
    const [mode, setMode] = useState<AuthMode>("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const isRegistering = mode === "register";

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (isRegistering) {
                const response = await apiFetch("/auth/register", {
                    method: "POST",
                    body: JSON.stringify({ name, email, password }),
                });
                const data = await response.json();
                console.log("Registration successful:", data);
                setMode("login");
                setPassword("");
                return;
            }

            const response = await apiFetch("/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            console.log("Login successful:", data);
            await login();
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 overflow-hidden selection:bg-indigo-500/30">
            {/* Theme Toggle Top Right */}
            <div className="absolute top-6 right-6 z-50">
                <ThemeToggle />
            </div>

            {/* Decorative mesh gradient background */}
            <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none">
                <div className="absolute w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-purple-400/20 dark:bg-purple-900/30 rounded-full blur-3xl -top-20 -left-20 animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-indigo-400/20 dark:bg-indigo-900/30 rounded-full blur-3xl -bottom-40 -right-20 animate-pulse" style={{ animationDuration: '10s' }} />
                <div className="absolute w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-blue-400/20 dark:bg-blue-900/30 rounded-full blur-3xl top-40 right-20 animate-pulse" style={{ animationDuration: '12s' }} />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md mx-4"
            >
                <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/50 dark:border-slate-800/50 shadow-2xl rounded-3xl p-8 sm:p-10 overflow-hidden relative">
                    
                    {/* Glassmorphic Shine */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent" />
                    
                    <div className="flex flex-col items-center mb-8">
                        <div className="h-16 w-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 mb-5 relative group cursor-default">
                            <Bot className="h-8 w-8 transition-transform duration-500 group-hover:scale-110" />
                            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-300 animate-pulse" />
                        </div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                            SupportPilot
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
                            {isRegistering ? "Create your workspace" : "Welcome back, pilot"}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                className="bg-red-50/80 dark:bg-red-500/10 border border-red-200/50 dark:border-red-500/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm font-medium text-center backdrop-blur-sm"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <AnimatePresence mode="wait">
                            {isRegistering && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-1 overflow-hidden"
                                >
                                    <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">
                                        Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                        placeholder="Jane Doe"
                                        required
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-1">
                            <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                placeholder="jane@example.com"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                placeholder="••••••••"
                                minLength={8}
                                maxLength={128}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full relative group overflow-hidden rounded-xl bg-indigo-600 text-white font-semibold py-3.5 mt-2 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 active:scale-[0.98] transition-all disabled:opacity-70 disabled:active:scale-100"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-500" />
                            <span className="relative flex items-center justify-center gap-2">
                                {loading ? "Processing..." : isRegistering ? "Create Account" : "Sign In"}
                                {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                            </span>
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
                        {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
                        <button
                            type="button"
                            onClick={() => setMode(isRegistering ? "login" : "register")}
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors ml-1 relative group inline-block"
                        >
                            {isRegistering ? "Sign in instead" : "Create one now"}
                            <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-indigo-600 dark:bg-indigo-400 transition-all group-hover:w-full" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}