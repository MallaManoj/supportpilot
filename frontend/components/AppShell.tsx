"use client";

import { useState, useEffect } from "react";

import ConversationList from "@/components/ConversationList";
import ChatWindow from "@/components/ChatWindow";
import type { User } from "@/types/user";
import type { Conversation } from "@/types/conversation";
import { apiFetch } from "@/lib/api";

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
            if (response.ok) {
                setConversations(data.conversations || []);
            } else {
                alert(`Load Conversations Failed: ${data.detail || JSON.stringify(data)}`);
            }
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
            if (response.ok) {
                setSelectedConversationId(data.conversation_id);
                await loadConversations();
            } else {
                alert(`Create Conversation Failed: ${data.detail || JSON.stringify(data)}`);
            }
        } catch (error: any) {
            console.error("Failed to create conversation:", error);
            alert(`Create Conversation Error: ${error.message || error}`);
        }
    };

    return (
        <main className="flex min-h-screen">
            <aside className="w-80 border-r">
                <div className="border-b p-4">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm">{user.email}</p>

                    <button
                        type="button"
                        onClick={onLogout}
                        className="mt-3 rounded border px-3 py-1"
                    >
                        Logout
                    </button>
                </div>

                <ConversationList
                    conversations={conversations}
                    selectedConversationId={selectedConversationId}
                    onSelectConversation={setSelectedConversationId}
                    onCreateConversation={handleCreateConversation}
                />
            </aside>

            <section className="flex-1">
                {selectedConversationId !== null ? (
                    <ChatWindow
                        conversationId={selectedConversationId}
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <p>Select a conversation to begin.</p>
                    </div>
                )}
            </section>
        </main>
    );
}