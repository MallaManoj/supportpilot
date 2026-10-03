import type { Message } from "@/types/message";

const messages: Message[] = [
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
    return (
        <div className="mt-8 space-y-4">
            {messages.map((message) => (
                <div
                    key={message.id}
                    className="rounded-2xl bg-white p-5 shadow-sm"
                >
                    <p className="text-sm font-medium text-gray-500">
                        {message.role === "customer" ? "Customer" : "SupportPilot"}
                    </p>

                    <p className="mt-2 text-gray-900">
                        {message.content}
                    </p>
                </div>
            ))}
        </div>
    );
}