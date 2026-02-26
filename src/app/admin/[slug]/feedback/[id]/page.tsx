import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { StatusForm } from "./StatusForm";
import { CommentSection } from "./CommentSection";

export default async function AdminFeedbackDetail({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect("/admin/login");

  const { slug, id } = await params;

  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) notFound();

  const feedback = await prisma.feedback.findUnique({
    where: { id },
    include: {
      comments: { orderBy: { createdAt: "asc" } },
      _count: { select: { votes: true } },
    },
  });
  if (!feedback || feedback.productId !== product.id) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto max-w-3xl flex items-center gap-3">
          <Link href={`/admin/${slug}`} className="text-sm text-gray-400 hover:text-gray-600">← Back</Link>
          <h1 className="text-lg font-bold text-gray-900 truncate">{feedback.title}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8 space-y-6">
        {/* Detail card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
            <span>{feedback.authorName}</span>
            <span>·</span>
            <span>{feedback.authorEmail || "no email"}</span>
            <span>·</span>
            <span>▲ {feedback.score}</span>
            <span>·</span>
            <span>{new Date(feedback.createdAt).toLocaleString()}</span>
          </div>
          {feedback.body && (
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{feedback.body}</p>
          )}
        </div>

        {/* Status management */}
        <StatusForm feedbackId={feedback.id} currentStatus={feedback.status.toLowerCase()} />

        {/* Comments */}
        <CommentSection feedbackId={feedback.id} comments={feedback.comments} />
      </main>
    </div>
  );
}
