import Link from "next/link";

const features = [
  {
    icon: "📋",
    title: "Multi-Product Boards",
    desc: "Create separate feedback boards for each product or project — all from one account.",
  },
  {
    icon: "🗳️",
    title: "Community Voting",
    desc: "Let users upvote the features they care about most. Priorities surface naturally.",
  },
  {
    icon: "🔒",
    title: "Admin Dashboard",
    desc: "Review, respond, and manage all feedback from a clean admin interface.",
  },
  {
    icon: "📊",
    title: "Status Tracking",
    desc: "Mark items as New, Under Review, Planned, In Progress, or Done. Keep your users in the loop.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-4">
          <span className="text-xl font-bold text-gray-900">
            📝 Whisprboard
          </span>
          <Link
            href="/squadroll"
            className="text-sm font-medium text-orange-600 hover:text-orange-700"
          >
            View Demo →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
          Feedback boards
          <br />
          <span className="text-orange-500">your users will actually use</span>
        </h1>
        <p className="mt-6 text-lg text-gray-500 max-w-xl mx-auto">
          Collect feature requests, bug reports, and ideas — then let your
          community vote on what matters most. Lightweight. Fast. No sign-up
          friction.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/squadroll"
            className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-orange-600 transition-colors"
          >
            See it in action
          </Link>
          <a
            href="https://github.com/JeremyCarlsten/whisprboard"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
          >
            GitHub ↗
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Whisprboard. Open-source on{" "}
        <a
          href="https://github.com/JeremyCarlsten/whisprboard"
          className="underline hover:text-gray-600"
        >
          GitHub
        </a>
        .
      </footer>
    </div>
  );
}
