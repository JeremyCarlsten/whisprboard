import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

const STATUS_OPTIONS = ["open", "in-progress", "planned", "done", "closed"] as const;

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    open: "bg-blue-100 text-blue-700",
    "in-progress": "bg-yellow-100 text-yellow-700",
    planned: "bg-purple-100 text-purple-700",
    done: "bg-green-100 text-green-700",
    closed: "bg-gray-100 text-gray-500",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || colors.open}`}>
      {status}
    </span>
  );
}

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect("/admin/login");

  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) notFound();

  const feedback = await prisma.feedback.findMany({
    where: { productId: product.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { votes: true, comments: true } } },
  });

  const statusCounts: Record<string, number> = {};
  for (const s of STATUS_OPTIONS) statusCounts[s] = 0;
  for (const f of feedback) {
    const s = f.status.toLowerCase();
    statusCounts[s] = (statusCounts[s] || 0) + 1;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/${slug}`} className="text-sm text-gray-400 hover:text-gray-600">← Board</Link>
            <h1 className="text-lg font-bold text-gray-900">Admin: {product.name}</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          {STATUS_OPTIONS.map((s) => (
            <div key={s} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{statusCounts[s]}</div>
              <StatusBadge status={s} />
            </div>
          ))}
        </div>

        {/* Feedback list */}
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          All Feedback ({feedback.length})
        </h2>
        <div className="space-y-2">
          {feedback.map((f) => (
            <Link
              key={f.id}
              href={`/admin/${slug}/feedback/${f.id}`}
              className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">{f.title}</h3>
                    <StatusBadge status={f.status.toLowerCase()} />
                  </div>
                  {f.body && <p className="text-sm text-gray-500 line-clamp-1">{f.body}</p>}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span>{f.authorName}</span>
                    <span>▲ {f.score}</span>
                    <span>💬 {f._count.comments}</span>
                    <span>{new Date(f.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {feedback.length === 0 && (
            <p className="text-center py-12 text-gray-400">No feedback yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}
