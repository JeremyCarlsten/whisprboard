"use client";

import { useState } from "react";

const STATUSES = [
  "New",
  "Under Review",
  "Planned",
  "In Progress",
  "Done",
  "Declined",
] as const;

const STATUS_COLORS: Record<string, string> = {
  New: "bg-gray-100 text-gray-700",
  "Under Review": "bg-blue-100 text-blue-700",
  Planned: "bg-purple-100 text-purple-700",
  "In Progress": "bg-yellow-100 text-yellow-800",
  Done: "bg-green-100 text-green-700",
  Declined: "bg-red-100 text-red-700",
};

type FeedbackItem = {
  id: string;
  title: string;
  body: string;
  authorName: string;
  score: number;
  status: string;
  adminNote: string;
  createdAt: string | Date;
  _count: { votes: number };
};

type Product = {
  id: string;
  slug: string;
  name: string;
};

export function AdminDashboard({
  product,
  feedback: initialFeedback,
  slug,
}: {
  product: Product;
  feedback: FeedbackItem[];
  slug: string;
}) {
  const [authed, setAuthed] = useState(false);
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState(initialFeedback);
  const [saving, setSaving] = useState<string | null>(null);

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl border border-gray-200 p-8 w-full max-w-sm">
          <h1 className="text-lg font-semibold text-gray-900 mb-4">
            Admin Login
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (secret.trim()) {
                setAuthed(true);
                setError("");
              }
            }}
          >
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Admin secret"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 mb-3"
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 px-4 rounded-lg text-sm"
            >
              Enter
            </button>
            {error && (
              <p className="text-sm text-red-600 mt-2">{error}</p>
            )}
          </form>
        </div>
      </div>
    );
  }

  async function updateFeedback(
    id: string,
    data: { status?: string; adminNote?: string }
  ) {
    setSaving(id);
    const res = await fetch("/api/admin/feedback", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": secret,
      },
      body: JSON.stringify({ id, ...data }),
    });

    if (res.status === 401) {
      setAuthed(false);
      setError("Invalid secret");
      setSaving(null);
      return;
    }

    if (res.ok) {
      const updated = await res.json();
      setFeedback((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...updated } : f))
      );
    }
    setSaving(null);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {product.name} — Admin
            </span>
          </div>
          <a
            href={`/${slug}`}
            className="text-sm text-orange-600 hover:underline"
          >
            ← Back to board
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <h1 className="text-xl font-bold text-gray-900 mb-6">
          Feedback ({feedback.length})
        </h1>

        {feedback.length === 0 ? (
          <p className="text-gray-400">No feedback yet.</p>
        ) : (
          <div className="space-y-4">
            {feedback.map((item) => (
              <AdminFeedbackCard
                key={item.id}
                item={item}
                saving={saving === item.id}
                onUpdate={(data) => updateFeedback(item.id, data)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function AdminFeedbackCard({
  item,
  saving,
  onUpdate,
}: {
  item: FeedbackItem;
  saving: boolean;
  onUpdate: (data: { status?: string; adminNote?: string }) => void;
}) {
  const [note, setNote] = useState(item.adminNote);
  const [editingNote, setEditingNote] = useState(false);

  const date = new Date(item.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 text-sm">
              {item.title}
            </h3>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[item.status] || STATUS_COLORS.New}`}
            >
              {item.status}
            </span>
          </div>
          {item.body && (
            <p className="text-sm text-gray-500 mt-1">{item.body}</p>
          )}
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
            <span>{item.authorName}</span>
            <span>·</span>
            <span>{date}</span>
            <span>·</span>
            <span>▲ {item.score} votes</span>
          </div>
        </div>

        <select
          value={item.status}
          onChange={(e) => onUpdate({ status: e.target.value })}
          disabled={saving}
          className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        {editingNote ? (
          <div className="flex gap-2">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-y"
              placeholder="Add an admin note..."
            />
            <div className="flex flex-col gap-1">
              <button
                onClick={() => {
                  onUpdate({ adminNote: note });
                  setEditingNote(false);
                }}
                disabled={saving}
                className="text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setNote(item.adminNote);
                  setEditingNote(false);
                }}
                className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setEditingNote(true)}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            {item.adminNote ? (
              <span className="text-gray-600">
                📝 {item.adminNote}
                <span className="text-gray-400 ml-1">(edit)</span>
              </span>
            ) : (
              "＋ Add admin note"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
