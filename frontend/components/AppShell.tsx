"use client";

import { useState, useEffect } from "react";
import { LogOut, User as UserIcon, ShieldAlert } from "lucide-react";
import ConversationList from "@/components/ConversationList";
import ChatWindow from "@/components/ChatWindow";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { User } from "@/types/user";
import type { Conversation } from "@/types/conversation";
import { apiFetch } from "@/lib/api";
import Link from "next/link";

type AppShellProps = {
    user: User;
    onLogout: () => void;
};

export default function AppShell({
    user,
    onLogout,
}: AppShellProps) {
    const [selectedConversationId, setSelectedConversationId] =
        useState<number | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);

    const loadConversations = async () => {
        try {
            const response = await apiFetch("/conversations");
            const data = await response.json();
            setConversations(data.conversations || []);
        } catch (error: any) {
            console.error("Failed to load conversations:", error);
            alert(`Load Conversations Error: ${error.message || error}`);
        }
    };

    useEffect(() => {
        loadConversations();
    }, []);

    const handleCreateConversation = async () => {
        try {
            const response = await apiFetch("/conversations", {
                method: "POST",
            });
            const data = await response.json();
            setSelectedConversationId(data.conversation_id);
            await loadConversations();
        } catch (error: any) {
            console.error("Failed to create conversation:", error);
            alert(`Create Conversation Error: ${error.message || error}`);
        }
    };

    return (
        <main className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden text-slate-900 dark:text-slate-100 selection:bg-indigo-500/30">
            {/* Sidebar */}
            <aside className="w-80 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl z-10">
                {/* User Profile Area */}
                <div className="border-b border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                                <UserIcon className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <p className="font-semibold text-sm leading-tight">{user.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[150px]">{user.email}</p>
                            </div>
                        </div>
                        <ThemeToggle />
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-2">
                        {user.role && ["admin", "agent"].includes(user.role) && (
                            <Link href="/dashboard" className="flex-1 flex justify-center items-center gap-2 py-2 px-3 text-xs font-medium rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors">
                                <ShieldAlert className="h-3.5 w-3.5" />
                                Dashboard
                            </Link>
                        )}
                        <button
                            type="button"
                            onClick={onLogout}
                            className="flex-1 flex justify-center items-center gap-2 py-2 px-3 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <LogOut className="h-3.5 w-3.5" />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Conversation List */}
                <div className="flex-1 overflow-y-auto">
                    <ConversationList
                        conversations={conversations}
                        selectedConversationId={selectedConversationId}
                        onSelectConversation={setSelectedConversationId}
                        onCreateConversation={handleCreateConversation}
                    />
                </div>
            </aside>

            {/* Main Chat Area */}
            <section className="flex-1 flex flex-col relative bg-transparent z-0">
                {/* Decorative background blobs */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                    <div className="absolute -top-[40%] -left-[10%] w-[70%] h-[70%] rounded-full bg-purple-400/10 dark:bg-purple-900/10 blur-3xl opacity-50" />
                    <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-400/10 dark:bg-indigo-900/10 blur-3xl opacity-50" />
                </div>
                
                {selectedConversationId !== null ? (
                    <ChatWindow
                        conversationId={selectedConversationId}
                    />
                ) : (
                    <div className="flex flex-col h-full items-center justify-center text-slate-500 dark:text-slate-400 gap-4">
                        <div className="h-16 w-16 rounded-2xl bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none flex items-center justify-center border border-slate-100 dark:border-slate-800">
                            <span className="text-2xl">✨</span>
                        </div>
                        <p className="font-medium">Select a conversation to begin.</p>
                    </div>
                )}
            </section>
        </main>
    );
}