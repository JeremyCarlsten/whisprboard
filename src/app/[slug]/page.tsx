import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { FeedbackList } from "./FeedbackList";
import { SubmitForm } from "./SubmitForm";

export default async function BoardPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const { slug } = await params;
  const { sort } = await searchParams;

  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) notFound();

  const sortMode = sort === "recent" ? "recent" : "top";

  const feedback = await prisma.feedback.findMany({
    where: { productId: product.id },
    orderBy:
      sortMode === "recent" ? { createdAt: "desc" } : { score: "desc" },
    include: {
      _count: { select: { votes: true } },
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {product.name} ↗
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex items-center justify-end gap-2 mb-6">
          <SortTab href={`/${slug}?sort=top`} active={sortMode === "top"}>
            ⭐ Top
          </SortTab>
          <SortTab href={`/${slug}?sort=recent`} active={sortMode === "recent"}>
            🕐 Recent
          </SortTab>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <SubmitForm productSlug={slug} />
          </div>
          <div className="lg:col-span-2">
            <FeedbackList items={feedback} productSlug={slug} />
          </div>
        </div>
      </main>
    </div>
  );
}

function SortTab({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        active
          ? "bg-gray-900 text-white"
          : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
      }`}
    >
      {children}
    </a>
  );
}
