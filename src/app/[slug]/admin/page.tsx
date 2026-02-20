import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { AdminDashboard } from "./AdminDashboard";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) notFound();

  const feedback = await prisma.feedback.findMany({
    where: { productId: product.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { votes: true } },
    },
  });

  return <AdminDashboard product={product} feedback={feedback} slug={slug} />;
}
