"use client";

import { useState } from "react";

const STATUS_OPTIONS = ["open", "in-progress", "planned", "done", "closed"];
const STATUS_COLORS: Record<string, string> = {
  open: "bg-blue-100 text-blue-700 border-blue-200",
  "in-progress": "bg-yellow-100 text-yellow-700 border-yellow-200",
  planned: "bg-purple-100 text-purple-700 border-purple-200",
  done: "bg-green-100 text-green-700 border-green-200",
  closed: "bg-gray-100 text-gray-500 border-gray-200",
};

export function StatusForm({
  feedbackId,
  currentStatus,
}: {
  feedbackId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);

  async function updateStatus(newStatus: string) {
    setSaving(true);
    const res = await fetch(`/api/feedback/${feedbackId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) setStatus(newStatus);
    setSaving(false);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Status</h3>
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => updateStatus(s)}
            disabled={saving}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              s === status
                ? STATUS_COLORS[s] + " ring-2 ring-offset-1 ring-gray-300"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
