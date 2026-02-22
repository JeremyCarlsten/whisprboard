import { prisma } from "@/lib/db";
import { isAdminRequest } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";

const VALID_STATUSES = ["open", "in-progress", "planned", "done", "closed"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const data: Record<string, string> = {};
  if (body.status) {
    const status = body.status.toLowerCase();
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    data.status = status;
  }
  if (body.adminNote !== undefined) {
    data.adminNote = body.adminNote;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  try {
    const feedback = await prisma.feedback.update({ where: { id }, data });
    return NextResponse.json(feedback);
  } catch {
    return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
  }
}
