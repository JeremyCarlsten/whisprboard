"use client";

import { useState } from "react";

type Comment = {
  id: string;
  body: string;
  authorName: string;
  isAdmin: boolean;
  createdAt: string | Date;
};

export function CommentSection({
  feedbackId,
  comments: initialComments,
}: {
  feedbackId: string;
  comments: Comment[];
}) {
  const [comments, setComments] = useState(initialComments);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);

    const res = await fetch(`/api/feedback/${feedbackId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: body.trim(), authorName: "Admin", isAdmin: true }),
    });

    if (res.ok) {
      const comment = await res.json();
      setComments((prev) => [...prev, comment]);
      setBody("");
    }
    setSubmitting(false);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Comments ({comments.length})
      </h3>

      <div className="space-y-3 mb-4">
        {comments.map((c) => (
          <div
            key={c.id}
            className={`p-3 rounded-lg text-sm ${
              c.isAdmin
                ? "bg-orange-50 border border-orange-100"
                : "bg-gray-50 border border-gray-100"
            }`}
          >
            <div className="flex items-center gap-2 mb-1 text-xs text-gray-400">
              <span className="font-medium text-gray-600">{c.authorName}</span>
              {c.isAdmin && (
                <span className="bg-orange-200 text-orange-700 px-1.5 py-0.5 rounded text-[10px] font-medium">
                  ADMIN
                </span>
              )}
              <span>{new Date(c.createdAt).toLocaleString()}</span>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{c.body}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-sm text-gray-400">No comments yet.</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a response..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={submitting || !body.trim()}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          Reply
        </button>
      </form>
    </div>
  );
}
