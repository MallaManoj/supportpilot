"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

type AuthMode = "login" | "register";

export default function AuthForm() {
    const { login } = useAuth();
    const [mode, setMode] = useState<AuthMode>("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const isRegistering = mode === "register";

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            if (mode === "register") {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify({
                            name,
                            email,
                            password,
                        }),
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.detail || "Registration failed"
                    );
                }

                console.log(
                    "Registration successful:",
                    data
                );

                setMode("login");
                setPassword("");
                return;
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                    credentials: "include", // Essential for receiving httponly cookie
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail || "Login failed"
                );
            }

            console.log("Login successful:", data);

            // Fetch the user data using the HttpOnly cookie
            await login();
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        SupportPilot
                    </h1>

                    <p className="mt-2 text-sm text-gray-600">
                        {isRegistering
                            ? "Create your support account"
                            : "Sign in to your support account"}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    {isRegistering && (
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Name
                            </label>

                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                                placeholder="Your name"
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label
                            htmlFor="email"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                    >
                        {isRegistering ? "Create account" : "Sign in"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    {isRegistering
                        ? "Already have an account?"
                        : "Don't have an account?"}

                    <button
                        type="button"
                        onClick={() =>
                            setMode(
                                isRegistering
                                    ? "login"
                                    : "register"
                            )
                        }
                        className="ml-1 font-medium text-blue-600 hover:underline"
                    >
                        {isRegistering ? "Sign in" : "Create one"}
                    </button>
                </div>
            </div>
        </div>
    );
}