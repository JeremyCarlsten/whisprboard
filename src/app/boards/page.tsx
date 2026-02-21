import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { feedback: true } },
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-6 py-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-bold text-gray-900">Whisprboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Feature suggestions & feedback boards
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        {products.length === 0 ? (
          <p className="text-gray-400 text-center py-16">
            No boards yet. Create a product to get started.
          </p>
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/${product.slug}`}
                className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-orange-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {product.name}
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                      /{product.slug}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {product._count.feedback} suggestion
                    {product._count.feedback !== 1 ? "s" : ""}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
