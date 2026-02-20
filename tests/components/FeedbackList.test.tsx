import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeedbackList } from "../../src/app/[slug]/FeedbackList";

const mockItems = [
  {
    id: "1",
    title: "Add dark mode",
    body: "Would love a dark theme",
    authorName: "Alice",
    score: 5,
    status: "Planned",
    createdAt: "2026-01-15T00:00:00Z",
    _count: { votes: 5 },
  },
  {
    id: "2",
    title: "Mobile app",
    body: "",
    authorName: "Bob",
    score: 2,
    status: "New",
    createdAt: "2026-02-01T00:00:00Z",
    _count: { votes: 2 },
  },
];

describe("FeedbackList", () => {
  it("renders empty state when no items", () => {
    render(<FeedbackList items={[]} productSlug="demo" />);
    expect(screen.getByText("No suggestions yet.")).toBeInTheDocument();
  });

  it("renders feedback items", () => {
    render(<FeedbackList items={mockItems} productSlug="demo" />);
    expect(screen.getByText("Add dark mode")).toBeInTheDocument();
    expect(screen.getByText("Mobile app")).toBeInTheDocument();
  });

  it("shows status badge for non-New items", () => {
    render(<FeedbackList items={mockItems} productSlug="demo" />);
    expect(screen.getByText("Planned")).toBeInTheDocument();
  });
});
