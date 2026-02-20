import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Prisma schema sanity", () => {
  const schema = fs.readFileSync(
    path.resolve(process.cwd(), "prisma/schema.prisma"),
    "utf-8"
  );

  it("defines Product model", () => {
    expect(schema).toContain("model Product");
  });

  it("defines Feedback model", () => {
    expect(schema).toContain("model Feedback");
  });

  it("defines Vote model", () => {
    expect(schema).toContain("model Vote");
  });

  it("uses sqlite provider", () => {
    expect(schema).toContain('provider = "sqlite"');
  });

  it("Feedback has status and adminNote fields", () => {
    expect(schema).toContain("status");
    expect(schema).toContain("adminNote");
  });

  it("Vote has unique constraint on feedbackId+fingerprint", () => {
    expect(schema).toContain("@@unique([feedbackId, fingerprint])");
  });
});
