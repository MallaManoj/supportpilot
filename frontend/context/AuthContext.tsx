"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { User } from "@/types/user";

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
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to load authenticated user"
      );
    }

    const data: User = await response.json();

    setUser(data);
    setIsAuthenticated(true);
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
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

  const logout = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
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
