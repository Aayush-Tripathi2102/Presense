import Link from "next/link";
import { SERVICE_CATEGORIES } from "@/services/registry/types";
import { ServiceRegistry } from "@/services/registry";

export default function Landing() {
  const services = ServiceRegistry.all();
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
              T
            </div>
            <span className="text-lg font-semibold">Taro</span>
          </div>
          <nav className="flex gap-3">
            <Link href="/login" className="btn-secondary">
              Log in
            </Link>
            <Link href="/signup" className="btn-primary">
              Get started
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-14">
        <p className="badge bg-blue-50 text-blue-700">
          Marketing Operating System
        </p>
        <h1 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight">
          One platform for all your marketing services.
        </h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          Taro is a modular marketing OS: one account, one dashboard, and{" "}
          {services.length} independent services across{" "}
          {SERVICE_CATEGORIES.length} categories — from SEO and ads to social,
          content and analytics.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/signup" className="btn-primary">
            Create your account
          </Link>
          <Link href="/login" className="btn-secondary">
            Open dashboard
          </Link>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_CATEGORIES.slice(0, 6).map((c) => (
            <div key={c.id} className="card p-5">
              <h3 className="font-semibold">{c.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{c.description}</p>
              <p className="mt-2 text-xs text-slate-500">
                {ServiceRegistry.byCategory(c.id)
                  .map((s) => s.name)
                  .join(" · ")}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
