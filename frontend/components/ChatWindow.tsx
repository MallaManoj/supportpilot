"use client";

import { useState, useEffect, useRef } from "react";
import type { Message } from "@/types/message";
import { apiFetch } from "@/lib/api";
import { Send, AlertOctagon, Bot, User, Sparkles, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const initialMessages: Message[] = [
    {
        id: 1,
        role: "customer",
        content: "How can I reset my password?",
    },
    {
        id: 2,
        role: "assistant",
        content: "You can reset your password from the account settings page.",
    },
];

type ChatWindowProps = {
    conversationId: number | null;
};

export default function ChatWindow({ conversationId }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (conversationId !== null) {
            loadConversationHistory(conversationId);
        } else {
            setMessages(initialMessages);
        }
    }, [conversationId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    async function loadConversationHistory(id: number) {
        const response = await apiFetch(`/conversations/${id}/messages`);
        const data = await response.json();
        setMessages(
            (data.messages || []).map(
                (message: any) => ({
                    id: message.id,
                    role: message.role === "user" ? "customer" : message.role,
                    content: message.content,
                    citations: message.citations,
                })
            )
        );
    }

    const sendMessage = async () => {
        if (!input.trim() || loading) return;
        if (conversationId === null) return;

        const content = input.trim();
        const userMessage: Message = { id: Date.now(), role: "customer", content };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await apiFetch("/chat", {
                method: "POST",
                body: JSON.stringify({
                    message: content,
                    conversation_id: conversationId,
                }),
            });
            const data = await response.json();

            const assistantMessage: Message = {
                id: Date.now() + 1,
                role: "assistant",
                content: data.message || data.reply,
                citations: data.citations,
            };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error("Error:", error);
            const errorMessage: Message = {
                id: Date.now() + 1,
                role: "assistant",
                content: "Sorry, I couldn't connect to the support server.",
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const escalateToSupport = async () => {
        if (conversationId === null) return;
        setLoading(true);
        try {
            const response = await apiFetch("/tickets", {
                method: "POST",
                body: JSON.stringify({
                    conversation_id: conversationId,
                    subject: "Escalated from chat",
                    description: "User requested escalation from chat window.",
                }),
            });
            const data = await response.json();
            
            const systemMessage: Message = {
                id: Date.now() + 2,
                role: "assistant",
                content: `Your issue has been escalated.\n\nTicket #${data.ticket_id}\nStatus: Open`,
            };
            setMessages((prev) => [...prev, systemMessage]);
        } catch (err) {
            console.error("Failed to escalate", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl shadow-2xl relative rounded-l-3xl border-l border-white/20 dark:border-slate-800/50">
            {/* Header */}
            <div className="h-16 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between px-8 bg-white/20 dark:bg-slate-900/20 backdrop-blur-md z-10 rounded-tl-3xl">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                        <Bot className="h-4 w-4" />
                    </div>
                    <div>
                        <h1 className="font-semibold text-sm">SupportPilot AI</h1>
                        <p className="text-xs text-green-500 flex items-center gap-1">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            Online
                        </p>
                    </div>
                </div>
                
                <button
                    onClick={escalateToSupport}
                    disabled={loading || conversationId === null}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-500/20 transition-all disabled:opacity-50 border border-red-200 dark:border-red-900/30 shadow-sm"
                    title="Escalate to Human Agent"
                >
                    <AlertOctagon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Escalate Issue</span>
                </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                <AnimatePresence>
                    {messages.map((message) => {
                        const isAssistant = message.role === "assistant";
                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                key={message.id}
                                className={cn(
                                    "flex w-full gap-4 max-w-3xl mx-auto",
                                    isAssistant ? "flex-row" : "flex-row-reverse"
                                )}
                            >
                                <div className={cn(
                                    "h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-sm mt-1",
                                    isAssistant 
                                        ? "bg-gradient-to-tr from-blue-500 to-indigo-500 text-white" 
                                        : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                                )}>
                                    {isAssistant ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                                </div>
                                
                                <div className={cn(
                                    "flex flex-col gap-2 max-w-[80%]",
                                    isAssistant ? "items-start" : "items-end"
                                )}>
                                    <div className={cn(
                                        "px-5 py-3.5 shadow-sm text-[15px] leading-relaxed",
                                        isAssistant 
                                            ? "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl rounded-tl-sm border border-slate-100 dark:border-slate-700/50" 
                                            : "bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-2xl rounded-tr-sm"
                                    )}>
                                        <p className="whitespace-pre-wrap font-medium">{message.content}</p>
                                    </div>
                                    
                                    {message.citations && message.citations.length > 0 && (
                                        <motion.div 
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="mt-1 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-200/50 dark:border-slate-700/50 w-full"
                                        >
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                                                <BookOpen className="h-3 w-3" />
                                                Sources
                                            </div>
                                            <ul className="space-y-1.5">
                                                {message.citations.map((cite, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                        <span className="flex items-center justify-center h-4 w-4 rounded-full bg-slate-200 dark:bg-slate-700 text-[9px] font-bold mt-0.5 shrink-0">
                                                            {idx + 1}
                                                        </span>
                                                        <span className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors cursor-default">
                                                            {cite.title} 
                                                            <span className="opacity-50 ml-1">(Doc {cite.document_id})</span>
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                    
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex w-full gap-4 max-w-3xl mx-auto"
                        >
                            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                                <Sparkles className="h-4 w-4 animate-pulse" />
                            </div>
                            <div className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl rounded-tl-sm border border-slate-100 dark:border-slate-700/50 px-5 py-4 shadow-sm flex items-center gap-1">
                                <div className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                                <div className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                                <div className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white/20 dark:bg-slate-900/20 backdrop-blur-md border-t border-slate-200/50 dark:border-slate-800/50 rounded-bl-3xl">
                <div className="max-w-3xl mx-auto relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") sendMessage();
                        }}
                        placeholder="Type your message..."
                        className="w-full rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-5 py-4 pr-14 text-[15px] text-slate-900 dark:text-white outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm placeholder:text-slate-400"
                        disabled={loading}
                    />
                    
                    <button
                        onClick={sendMessage}
                        disabled={loading || !input.trim()}
                        className="absolute right-2 h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:scale-95 disabled:hover:bg-indigo-600"
                    >
                        <Send className="h-4 w-4 ml-0.5" />
                    </button>
                </div>
                <div className="max-w-3xl mx-auto mt-3 text-center">
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                        SupportPilot can make mistakes. Consider verifying important information.
                    </p>
                </div>
            </div>
        </div>
    );
}