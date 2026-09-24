import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-xs font-medium text-zinc-600">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        Phase 1 skeleton — placeholder integrations, no fake connections
      </div>
      <div>
        <h1 className="text-5xl font-bold tracking-tight">Velora</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600">
          The AI growth operating system. One Business Growth Profile powers SEO, AI search,
          content, social, paid, reputation and analytics.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/signup" className="rounded-lg bg-zinc-950 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800">
          Get started
        </Link>
        <Link href="/login" className="rounded-lg border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold hover:bg-zinc-100">
          Log in
        </Link>
        <Link href="/dashboard" className="rounded-lg border border-dashed border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-600 hover:bg-white">
          View dashboard skeleton
        </Link>
      </div>
      <div className="grid w-full gap-3 text-left sm:grid-cols-3">
        {[
          ["Business DNA", "Business, goals, products, audience, brand in one profile."],
          ["Channel execution", "SEO, social, content, paid, email, reputation from the same source of truth."],
          ["Honest placeholders", "Every unconnected integration is clearly marked. Nothing is faked."]
        ].map(([t, d]) => (
          <div key={t} className="rounded-xl border border-zinc-200 bg-white p-5">
            <p className="font-semibold">{t}</p>
            <p className="mt-1 text-sm text-zinc-600">{d}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
