import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AdminDashboard } from "../../src/app/[slug]/admin/AdminDashboard";

const product = { id: "p1", slug: "demo", name: "Demo App" };

const feedback = [
  {
    id: "f1",
    title: "Dark mode",
    body: "Please add dark mode",
    authorName: "Alice",
    score: 3,
    status: "New",
    adminNote: "",
    createdAt: "2026-01-15T00:00:00Z",
    _count: { votes: 3 },
  },
];

describe("AdminDashboard", () => {
  it("shows login form initially", () => {
    render(<AdminDashboard product={product} feedback={feedback} slug="demo" />);
    expect(screen.getByText("Admin Login")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Admin secret")).toBeInTheDocument();
  });
});
