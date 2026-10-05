"use client";

import { Conversation } from "@/types/conversation";
import { MessageSquarePlus, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type ConversationListProps = {
    conversations: Conversation[];
    selectedConversationId: number | null;
    onSelectConversation: (id: number) => void;
    onCreateConversation: () => void;
};

export default function ConversationList({
    conversations,
    selectedConversationId,
    onSelectConversation,
    onCreateConversation,
}: ConversationListProps) {
    return (
        <div className="flex flex-col h-full bg-transparent p-4">
            <div className="flex items-center justify-between mb-6 px-2">
                <h2 className="text-sm uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
                    Your Chats
                </h2>
            </div>

            <button
                onClick={onCreateConversation}
                className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-700 hover:shadow-indigo-600/30 active:scale-[0.98] mb-6 overflow-hidden"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-500" />
                <MessageSquarePlus className="h-4 w-4" />
                <span>New Conversation</span>
            </button>

            <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 pr-1">
                <AnimatePresence>
                    {(conversations || []).map((conversation, idx) => {
                        const isSelected = selectedConversationId === conversation.id;
                        return (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                key={conversation.id}
                                onClick={() => onSelectConversation(conversation.id)}
                                className={cn(
                                    "flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all duration-200 group relative overflow-hidden",
                                    isSelected
                                        ? "bg-white dark:bg-slate-800 shadow-sm shadow-slate-200/50 dark:shadow-none text-indigo-600 dark:text-indigo-400 font-medium border border-slate-100 dark:border-slate-700/50"
                                        : "hover:bg-white/60 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300 border border-transparent hover:border-slate-100 dark:hover:border-slate-700/30"
                                )}
                            >
                                {isSelected && (
                                    <motion.div 
                                        layoutId="active-indicator" 
                                        className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r-full" 
                                    />
                                )}
                                <MessageCircle className={cn(
                                    "h-4 w-4 shrink-0 transition-colors",
                                    isSelected ? "text-indigo-500" : "text-slate-400 group-hover:text-indigo-400"
                                )} />
                                <span className="truncate text-sm">
                                    {conversation.title ?? "Untitled conversation"}
                                </span>
                            </motion.button>
                        );
                    })}
                </AnimatePresence>
                
                {conversations.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 text-center opacity-60">
                        <MessageCircle className="h-8 w-8 mb-3 text-slate-400" />
                        <p className="text-sm text-slate-500 dark:text-slate-400">No conversations yet.<br/>Start one above!</p>
                    </div>
                )}
            </div>
        </div>
    );
}