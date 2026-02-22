import { auth } from "./auth";
import { NextRequest } from "next/server";

export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await auth();
  if (!session?.user) return false;
  // @ts-expect-error - role is added by us
  return session.user.role === "admin";
}

export async function isAdminRequest(req: NextRequest): Promise<boolean> {
  // For API routes, we still check the session
  const session = await auth();
  if (!session?.user) return false;
  // @ts-expect-error - role is added by us
  return session.user.role === "admin";
}
