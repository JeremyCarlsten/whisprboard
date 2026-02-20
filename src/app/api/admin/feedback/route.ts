import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

const VALID_STATUSES = [
  "New",
  "Under Review",
  "Planned",
  "In Progress",
  "Done",
  "Declined",
];

function checkAuth(req: NextRequest): boolean {
  const secret = req.headers.get("x-admin-secret");
  return !!process.env.ADMIN_SECRET && secret === process.env.ADMIN_SECRET;
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, status, adminNote } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const data: Record<string, string> = {};
    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) {
        return NextResponse.json(
          { error: `Invalid status. Valid: ${VALID_STATUSES.join(", ")}` },
          { status: 400 }
        );
      }
      data.status = status;
    }
    if (adminNote !== undefined) {
      data.adminNote = adminNote;
    }

    const updated = await prisma.feedback.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating feedback:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
