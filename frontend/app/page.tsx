"use client";

import { useEffect, useState } from "react";

import AuthForm from "@/components/AuthForm";
import { Conversation } from "@/types/conversation";
import type { User } from "@/types/user";
import AppShell from "@/components/AppShell";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
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
    <AppShell
      user={user!}
      onLogout={handleLogout}
    />
  );
}