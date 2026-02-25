import { describe, it, expect, vi, beforeEach } from "vitest";
import { prisma } from "../mocks/db";

const mod = await import("../../src/app/api/feedback/[id]/vote/route");
const POST = mod.POST;

function makeRequest(): Request {
  return new Request("http://localhost/api/feedback/f1/vote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": "1.2.3.4",
      "user-agent": "test-agent",
    },
    body: JSON.stringify({}),
  });
}

describe("POST /api/feedback/[id]/vote", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 404 if feedback not found", async () => {
    prisma.feedback.findUnique.mockResolvedValue(null);
    const res = await POST(makeRequest(), { params: Promise.resolve({ id: "f1" }) });
    expect(res.status).toBe(404);
  });

  it("returns 409 if already voted", async () => {
    prisma.feedback.findUnique.mockResolvedValue({ id: "f1", score: 5 });
    prisma.vote.findUnique.mockResolvedValue({ id: "v1" });
    const res = await POST(makeRequest(), { params: Promise.resolve({ id: "f1" }) });
    expect(res.status).toBe(409);
  });

  it("creates vote and increments score", async () => {
    prisma.feedback.findUnique.mockResolvedValue({ id: "f1", score: 5 });
    prisma.vote.findUnique.mockResolvedValue(null);
    prisma.vote.create.mockResolvedValue({ id: "v1" });
    prisma.feedback.update.mockResolvedValue({ id: "f1", score: 6 });

    const res = await POST(makeRequest(), { params: Promise.resolve({ id: "f1" }) });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.score).toBe(6);
  });
});
