"use client";

import { useState } from "react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setState("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setState("success");
        setEmail("");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <p className="text-green-600 font-medium text-sm">
        🎉 You&apos;re on the list! We&apos;ll be in touch.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        required
        className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-medium py-2.5 px-5 rounded-lg transition-colors text-sm whitespace-nowrap"
      >
        {state === "loading" ? "Joining..." : "Join waitlist"}
      </button>
      {state === "error" && (
        <p className="text-red-500 text-xs mt-1">Something went wrong.</p>
      )}
    </form>
  );
}
