"use client";

import { useState } from "react";

export default function ChatInput() {
    const [question, setQuestion] = useState("");

    return (
        <div className="mt-6 flex gap-3 rounded-2xl bg-white p-3 shadow-sm">
            <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask a question..."
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-gray-400"
            />

            <button
                type="button"
                className="rounded-xl bg-gray-900 px-5 py-3 font-medium text-white"
            >
                Send
            </button>
        </div>
    );
}