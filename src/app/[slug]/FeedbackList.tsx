"use client";

import { useState } from "react";

type FeedbackItem = {
  id: string;
  title: string;
  body: string;
  authorName: string;
  score: number;
  createdAt: string | Date;
  _count: { votes: number };
};

export function FeedbackList({
  items,
  productSlug,
}: {
  items: FeedbackItem[];
  productSlug: string;
}) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg">No suggestions yet.</p>
        <p className="text-sm mt-1">Be the first to suggest a feature!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <FeedbackCard key={item.id} item={item} productSlug={productSlug} />
      ))}
    </div>
  );
}

function FeedbackCard({
  item,
  productSlug,
}: {
  item: FeedbackItem;
  productSlug: string;
}) {
  const [score, setScore] = useState(item.score);
  const [voted, setVoted] = useState(false);

  async function handleVote() {
    if (voted) return;

    const res = await fetch(`/api/feedback/${item.id}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productSlug }),
    });

    if (res.ok) {
      const data = await res.json();
      setScore(data.score);
      setVoted(true);
    }
  }

  const date = new Date(item.createdAt);
  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex gap-4">
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
        {item.body && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.body}</p>
        )}
        <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
          <span>{item.authorName}</span>
          <span>·</span>
          <span>{dateStr}</span>
        </div>
      </div>
      <button
        onClick={handleVote}
        className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg border transition-colors min-w-[52px] ${
          voted
            ? "bg-orange-50 border-orange-200 text-orange-600"
            : "bg-gray-50 border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600"
        }`}
      >
        <svg
          className="w-4 h-4 mb-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
        <span className="text-sm font-semibold">{score}</span>
      </button>
    </div>
  );
}
