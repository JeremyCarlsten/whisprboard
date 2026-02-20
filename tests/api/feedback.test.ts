import { describe, it, expect, vi, beforeEach } from "vitest";
import { prisma } from "../mocks/db";

const { POST } = await import("../../src/app/api/feedback/route");

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }) as any;
}

describe("POST /api/feedback", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 400 if productSlug or title missing", async () => {
    const res = await POST(makeRequest({ productSlug: "", title: "" }));
    expect(res.status).toBe(400);
  });

  it("returns 404 if product not found", async () => {
    prisma.product.findUnique.mockResolvedValue(null);
    const res = await POST(makeRequest({ productSlug: "nope", title: "Test" }));
    expect(res.status).toBe(404);
  });

  it("creates feedback successfully", async () => {
    const product = { id: "p1", slug: "demo", name: "Demo" };
    const feedback = { id: "f1", title: "Test", body: "", productId: "p1", score: 0 };
    prisma.product.findUnique.mockResolvedValue(product);
    prisma.feedback.create.mockResolvedValue(feedback);

    const res = await POST(makeRequest({ productSlug: "demo", title: "Test" }));
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.id).toBe("f1");
  });
});
