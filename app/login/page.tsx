"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/dashboard-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError("Incorrect password.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fafafa] px-6">
      <div className="w-full max-w-md">

        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_12px_45px_rgba(0,0,0,0.05)]">

          <div className="h-1.5 w-full bg-orange-500" />

          <div className="p-8 sm:p-10">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-2xl text-white">
              ⚡
            </div>

            <p className="mt-7 text-[9px] font-semibold uppercase tracking-[0.3em] text-orange-500">
              CEREBRAS
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
              Host Control
            </h1>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Enter the host password to access Read the Room.
            </p>

            <form onSubmit={handleLogin} className="mt-8">

              <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Host Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                required
              />

              {error && (
                <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-5 w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Checking..." : "Enter Host Dashboard"}
              </button>

            </form>

            <p className="mt-6 text-center text-[8px] uppercase tracking-[0.2em] text-zinc-300">
              Cerebras · Read the Room
            </p>

          </div>
        </div>

      </div>
    </main>
  );
}