import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function AdminLoginPage() {
  async function loginAction(formData: FormData) {
    "use server";
    const token = formData.get("token") as string;
    const redirectTo = (formData.get("redirect") as string) || "/admin";
    if (token) {
      const cookieStore = await cookies();
      cookieStore.set("admin_token", token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }
    redirect(redirectTo);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl border border-gray-200 p-8 w-full max-w-sm">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Admin Login</h1>
        <form action={loginAction}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Admin Token
          </label>
          <input
            type="password"
            name="token"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Enter admin token"
          />
          <button
            type="submit"
            className="mt-4 w-full bg-gray-900 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
