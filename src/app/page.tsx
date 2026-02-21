import Link from "next/link";
import { WaitlistForm } from "./WaitlistForm";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">Whisprboard</span>
          <Link
            href="/boards"
            className="text-sm text-gray-600 hover:text-orange-600 transition-colors"
          >
            View boards →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
          Know what your users{" "}
          <span className="text-orange-500">actually want</span>
        </h1>
        <p className="mt-6 text-lg text-gray-500 max-w-xl mx-auto">
          Drop a feedback board into any product in minutes. Collect feature
          requests, let users vote, and ship what matters most.
        </p>
        <div className="mt-10 flex justify-center">
          <WaitlistForm />
        </div>
        <p className="mt-3 text-xs text-gray-400">
          Free while in beta. No credit card required.
        </p>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-4xl px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <FeatureCard
            emoji="📋"
            title="Feedback boards"
            desc="Create boards for each product. Users suggest features and upvote what matters."
          />
          <FeatureCard
            emoji="⚡"
            title="Takes 2 minutes"
            desc="Create a board, share the link. No code, no embed snippets, no setup."
          />
          <FeatureCard
            emoji="📊"
            title="Prioritize by signal"
            desc="See what your users want ranked by votes. Build with confidence."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-6 py-6">
        <p className="text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Whisprboard
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({
  emoji,
  title,
  desc,
}: {
  emoji: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
      <div className="text-3xl mb-3">{emoji}</div>
      <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
      <p className="text-sm text-gray-500 mt-2">{desc}</p>
    </div>
  );
}
