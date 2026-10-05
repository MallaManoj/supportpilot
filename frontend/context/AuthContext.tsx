"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { User } from "@/types/user";
import { apiFetch } from "@/lib/api";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  logout: () => Promise<void>;
  login: () => Promise<void>;
};

const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] =
    useState(false);
  const [isLoadingAuth, setIsLoadingAuth] =
    useState(true);

  const login = async () => {
    const response = await apiFetch("/auth/me");

    const data: User = await response.json();

    setUser(data);
    setIsAuthenticated(true);
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await apiFetch("/auth/me");

        const data: User = await response.json();

        setUser(data);
        setIsAuthenticated(true);
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

  const logout = async () => {
    try {
      await apiFetch("/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
