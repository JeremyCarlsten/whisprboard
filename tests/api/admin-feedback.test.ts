import { describe, it, expect, vi, beforeEach } from "vitest";
import { prisma } from "../mocks/db";

const { PATCH } = await import("../../src/app/api/admin/feedback/route");

function makeRequest(body: unknown, secret?: string): Request {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (secret) headers["x-admin-secret"] = secret;
  return new Request("http://localhost/api/admin/feedback", {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
  });
}

describe("PATCH /api/admin/feedback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ADMIN_SECRET = "test-secret";
  });

  it("returns 401 without valid secret", async () => {
    const res = await PATCH(makeRequest({ id: "f1", status: "Done" }));
    expect(res.status).toBe(401);
  });

  it("returns 401 with wrong secret", async () => {
    const res = await PATCH(makeRequest({ id: "f1", status: "Done" }, "wrong"));
    expect(res.status).toBe(401);
  });

  it("returns 400 without id", async () => {
    const res = await PATCH(makeRequest({ status: "Done" }, "test-secret"));
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid status", async () => {
    const res = await PATCH(makeRequest({ id: "f1", status: "Invalid" }, "test-secret"));
    expect(res.status).toBe(400);
  });

  it("updates status successfully", async () => {
    const updated = { id: "f1", status: "Done", adminNote: "" };
    prisma.feedback.update.mockResolvedValue(updated);

    const res = await PATCH(makeRequest({ id: "f1", status: "Done" }, "test-secret"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("Done");
  });

  it("updates adminNote", async () => {
    const updated = { id: "f1", status: "New", adminNote: "noted" };
    prisma.feedback.update.mockResolvedValue(updated);

    const res = await PATCH(makeRequest({ id: "f1", adminNote: "noted" }, "test-secret"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.adminNote).toBe("noted");
  });
});
