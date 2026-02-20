import { vi } from "vitest";

export const prisma = {
  product: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
  },
  feedback: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  vote: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
};

vi.mock("@/lib/db", () => ({ prisma }));
