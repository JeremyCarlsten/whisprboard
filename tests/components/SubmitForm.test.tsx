import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SubmitForm } from "../../src/app/[slug]/SubmitForm";

describe("SubmitForm", () => {
  it("renders the form", () => {
    render(<SubmitForm productSlug="demo" />);
    expect(screen.getByText("Suggest a feature")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Filter games by genre/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Suggest feature" })).toBeInTheDocument();
  });

  it("has a required title input", () => {
    render(<SubmitForm productSlug="demo" />);
    const input = screen.getByPlaceholderText(/Filter games by genre/) as HTMLInputElement;
    expect(input).toBeRequired();
  });

  it("disables submit when title is empty", () => {
    render(<SubmitForm productSlug="demo" />);
    const button = screen.getByRole("button", { name: "Suggest feature" });
    expect(button).toBeDisabled();
  });
});
