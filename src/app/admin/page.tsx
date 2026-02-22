import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function AdminIndexPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  // @ts-expect-error - role added by us
  if (session.user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl border border-gray-200 p-8 w-full max-w-sm text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-sm text-gray-500 mb-4">
            Your account ({session.user.email}) doesn&apos;t have admin access.
          </p>
          <form action={async () => { "use server"; const { signOut } = await import("@/lib/auth"); await signOut({ redirectTo: "/" }); }}>
            <button type="submit" className="text-sm text-gray-500 hover:text-gray-700 underline">Sign out</button>
          </form>
        </div>
      </div>
    );
  }

  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{session.user.email}</span>
            <form action={async () => { "use server"; const { signOut } = await import("@/lib/auth"); await signOut({ redirectTo: "/" }); }}>
              <button type="submit" className="text-sm text-gray-500 hover:text-gray-700 underline">Sign out</button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Products</h2>
        <div className="space-y-2">
          {products.map((p) => (
            <Link key={p.id} href={`/admin/${p.slug}`} className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors">
              <h3 className="font-semibold text-gray-900">{p.name}</h3>
              <p className="text-sm text-gray-500">/{p.slug}</p>
            </Link>
          ))}
          {products.length === 0 && <p className="text-center py-12 text-gray-400">No products yet.</p>}
        </div>
      </main>
    </div>
  );
}
