import { render, screen } from "@testing-library/react";
import { FeedbackList } from "@/app/[slug]/FeedbackList";

describe("FeedbackList", () => {
  it("renders an empty state message when there are no items", () => {
    render(<FeedbackList items={[]} productSlug="squadroll" />);

    expect(screen.getByText("No suggestions yet.")).toBeInTheDocument();
    expect(
      screen.getByText("Be the first to suggest a feature!"),
    ).toBeInTheDocument();
  });

  it("renders a list of feedback items when provided", () => {
    const items = [
      {
        id: "1",
        title: "Test feature",
        body: "Some description",
        authorName: "Alice",
        score: 3,
        status: "New",
        createdAt: new Date().toISOString(),
        _count: { votes: 1 },
      },
    ];

    render(<FeedbackList items={items} productSlug="squadroll" />);

    expect(screen.getByText("Test feature")).toBeInTheDocument();
    expect(screen.getByText("Some description")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });
});
