"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

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

  if (isLoadingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Checking authentication...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <AuthForm />
    );
  }

  return (
    <AppShell
      user={user!}
      onLogout={logout}
    />
  );
}