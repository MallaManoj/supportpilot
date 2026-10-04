"use client";

import { Conversation } from "@/types/conversation";

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
        <aside className="w-64 border-r bg-gray-50 p-4">
            <h2 className="mb-4 text-lg font-semibold">
                Conversations
            </h2>

            <button
                onClick={onCreateConversation}
                className="mb-4 w-full rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-100"
            >
                + New conversation
            </button>

            <div className="space-y-2">
                {conversations.map((conversation) => (
                    <button
                        key={conversation.id}
                        onClick={() =>
                            onSelectConversation(conversation.id)
                        }
                        className="block w-full rounded-lg p-3 text-left hover:bg-gray-200"
                    >
                        {conversation.title ?? "Untitled conversation"}
                    </button>
                ))}
            </div>
        </aside>
    );
}