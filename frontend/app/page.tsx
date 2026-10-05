"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

import AuthForm from "@/components/AuthForm";
import { Conversation } from "@/types/conversation";

import AppShell from "@/components/AppShell";

export default function Home() {
  const {
    user,
    isAuthenticated,
    isLoadingAuth,
    logout,
  } = useAuth();

  const [selectedConversationId, setSelectedConversationId] =
    useState<number | null>(null);

  const [backendError, setBackendError] = useState(false);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        await apiFetch("/health");
        setBackendError(false);
      } catch {
        setBackendError(true);
      }
    };

    checkBackend();
  }, []);

  if (backendError) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="rounded-lg border border-red-300 bg-red-50 p-6 text-center">
          <h1 className="text-xl font-semibold text-red-700">
            Backend unavailable
          </h1>

          <p className="mt-2 text-red-600">
            Please make sure the FastAPI server is running.
          </p>
        </div>
      </main>
    );
  }

  if (isLoadingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Checking authentication...</p>
      </main>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <AuthForm />
    );
  }

  return (
    <AppShell
      user={user}
      onLogout={logout}
    />
  );
}