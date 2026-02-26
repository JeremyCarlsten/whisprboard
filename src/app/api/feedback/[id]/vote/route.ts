import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

function getFingerprint(req: NextRequest): string {
  // Use a combination of IP + user agent as a simple fingerprint
  const headersList = req.headers;
  const forwarded = headersList.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  const ua = headersList.get("user-agent") || "unknown";
  // Simple hash-like string (not cryptographic, just for dedup)
  return `${ip}:${ua}`.slice(0, 200);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const fingerprint = getFingerprint(req);

    const feedback = await prisma.feedback.findUnique({
      where: { id },
    });

    if (!feedback) {
      return NextResponse.json(
        { error: "Feedback not found" },
        { status: 404 }
      );
    }

    // Check if already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        feedbackId_fingerprint: {
          feedbackId: id,
          fingerprint,
        },
      },
    });

    if (existingVote) {
      return NextResponse.json(
        { error: "Already voted", score: feedback.score },
        { status: 409 }
      );
    }

    // Create vote and update score atomically
    await prisma.vote.create({
      data: {
        feedbackId: id,
        fingerprint,
        value: 1,
      },
    });

    const updated = await prisma.feedback.update({
      where: { id },
      data: { score: { increment: 1 } },
    });

    return NextResponse.json({ score: updated.score });
  } catch (error) {
    console.error("Error voting:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
