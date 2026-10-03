"use client";

import { useState } from "react";
import type { Message } from "@/types/message";

const initialMessages: Message[] = [
    {
        id: 1,
        role: "customer",
        content: "How can I reset my password?",
    },
    {
        id: 2,
        role: "assistant",
        content:
            "You can reset your password from the account settings page.",
    },
];

export default function ChatWindow() {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const content = input.trim();

        const userMessage: Message = {
            id: Date.now(),
            role: "customer",
            content,
        };

        setMessages((currentMessages) => [
            ...currentMessages,
            userMessage,
        ]);

        setInput("");
        setLoading(true);

        try {
            const response = await fetch("http://127.0.0.1:8000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: content,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to send message");
            }

            const data = await response.json();

            const assistantMessage: Message = {
                id: Date.now() + 1,
                role: "assistant",
                content: data.reply,
            };

            setMessages((currentMessages) => [
                ...currentMessages,
                assistantMessage,
            ]);
        } catch (error) {
            console.error("Error:", error);

            const errorMessage: Message = {
                id: Date.now() + 1,
                role: "assistant",
                content:
                    "Sorry, I couldn't connect to the support server.",
            };

            setMessages((currentMessages) => [
                ...currentMessages,
                errorMessage,
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-8">
            {/* Messages */}
            <div className="space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className="rounded-2xl bg-white p-5 shadow-sm"
                    >
                        <p className="text-sm font-medium text-gray-500">
                            {message.role === "customer"
                                ? "Customer"
                                : "SupportPilot"}
                        </p>

                        <p className="mt-2 text-gray-900">
                            {message.content}
                        </p>
                    </div>
                ))}

                {loading && (
                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-gray-500">
                            SupportPilot
                        </p>

                        <p className="mt-2 text-gray-500">
                            Thinking...
                        </p>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="mt-6 flex gap-3">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            sendMessage();
                        }
                    }}
                    placeholder="Type your message..."
                    className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-gray-500"
                    disabled={loading}
                />

                <button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    className="rounded-xl bg-black px-6 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? "Sending..." : "Send"}
                </button>
            </div>
        </div>
    );
}