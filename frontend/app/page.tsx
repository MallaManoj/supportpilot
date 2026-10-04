"use client";

import { useEffect, useState } from "react";
import ConversationList from "@/components/ConversationList";
import ChatWindow from "@/components/ChatWindow";
import AuthForm from "@/components/AuthForm";
import { Conversation } from "@/types/conversation";
import type { User } from "@/types/user";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [selectedConversationId, setSelectedConversationId] =
    useState<number | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/auth/me",
          {
            credentials: "include",
          }
        );

        if (response.ok) {
          const data: User = await response.json();

          setUser(data);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error(
          "Authentication check failed:",
          error
        );

        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    checkAuthentication();
  }, []);

  const loadConversations = async () => {
    try {
      const response = await fetch("http://localhost:8000/conversations", {
        credentials: "include",
      });
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
    if (isAuthenticated) {
      loadConversations();
    }
  }, [isAuthenticated]);

  const handleCreateConversation = async () => {
    try {
      const response = await fetch("http://localhost:8000/conversations", {
        method: "POST",
        credentials: "include",
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

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );
    }
  };

  if (isLoadingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Checking authentication...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <AuthForm
        onAuthenticated={handleAuthenticated}
      />
    );
  }

  return (
    <main className="flex min-h-screen">
      <aside className="w-80 border-r flex flex-col">
        {user && (
          <div className="border-b p-4">
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm">{user.email}</p>
          </div>
        )}
        <ConversationList
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          onSelectConversation={setSelectedConversationId}
          onCreateConversation={handleCreateConversation}
        />
        <div className="p-4 border-t mt-auto">
          <button
            type="button"
            onClick={handleLogout}
            className="rounded border px-4 py-2 w-full hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
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