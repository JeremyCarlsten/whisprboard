import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const comments = await prisma.comment.findMany({
    where: { feedbackId: id },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(comments);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  if (!body.body?.trim()) {
    return NextResponse.json({ error: "body is required" }, { status: 400 });
  }

  const feedback = await prisma.feedback.findUnique({ where: { id } });
  if (!feedback) {
    return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
  }

  const comment = await prisma.comment.create({
    data: {
      feedbackId: id,
      body: body.body.trim(),
      authorName: body.authorName || "Anonymous",
      isAdmin: body.isAdmin === true,
    },
  });

  return NextResponse.json(comment, { status: 201 });
}
