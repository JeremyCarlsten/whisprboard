import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "admin-secret";

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  return token === ADMIN_TOKEN;
}

export function isAdminRequest(req: NextRequest): boolean {
  const header = req.headers.get("x-admin-token");
  if (header === ADMIN_TOKEN) return true;
  const cookie = req.cookies.get("admin_token")?.value;
  return cookie === ADMIN_TOKEN;
}
