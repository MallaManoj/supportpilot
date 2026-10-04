"use client";

import { useEffect, useState } from "react";
import ConversationList from "@/components/ConversationList";
import Header from "@/components/Header";
import ChatWindow from "@/components/ChatWindow";
import { Conversation } from "@/types/conversation";

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] =
    useState<number | null>(null);

  useEffect(() => {
    async function loadConversations() {
      const response = await fetch(
        "http://127.0.0.1:8000/conversations"
      );

      const data = await response.json();

      setConversations(data.conversations);
    }

    loadConversations();
  }, []);

  async function handleCreateConversation() {
      const response = await fetch(
          "http://127.0.0.1:8000/conversations",
          {
              method: "POST",
          }
      );

      const data = await response.json();

      const newConversation: Conversation = {
          id: data.conversation_id,
          title: "New conversation",
          created_at: new Date().toISOString(),
      };

      setConversations((current) => [
          newConversation,
          ...current,
      ]);

      setSelectedConversationId(data.conversation_id);
  }

  return (
    <div className="flex h-screen flex-col">
      <Header />

      <div className="flex flex-1">
        <ConversationList
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          onSelectConversation={setSelectedConversationId}
          onCreateConversation={handleCreateConversation}
        />

        <ChatWindow
          conversationId={selectedConversationId}
        />
      </div>
    </div>
  );
}