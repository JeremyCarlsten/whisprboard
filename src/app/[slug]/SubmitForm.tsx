"use client";

import { useState } from "react";

export function SubmitForm({ productSlug }: { productSlug: string }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug, title, body }),
      });

      if (res.ok) {
        setTitle("");
        setBody("");
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        // Refresh the page to show new feedback
        window.location.reload();
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Suggest a feature
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Short, descriptive title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Filter games by genre"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Tell us more about the feature you'd like to see..."
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-y"
          />
        </div>
        <button
          type="submit"
          disabled={submitting || !title.trim()}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
        >
          {submitting ? "Submitting..." : "Suggest feature"}
        </button>
        {success && (
          <p className="text-sm text-green-600 text-center">
            ✅ Thanks for your suggestion!
          </p>
        )}
      </form>
      <p className="text-xs text-gray-400 mt-4">
        🐛 Found a bug? Send an email to{" "}
        <a href="mailto:support@whisprboard.com" className="underline">
          support@whisprboard.com
        </a>
      </p>
    </div>
  );
}
