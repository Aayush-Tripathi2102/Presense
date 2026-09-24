import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";

const NAV: [string, string][] = [
  ["Overview", "/dashboard"],
  ["SEO", "/dashboard/seo"],
  ["Social", "/dashboard/social"],
  ["Content", "/dashboard/content"],
  ["Growth", "/dashboard/growth"],
  ["Analytics", "/dashboard/analytics"],
  ["Automation", "/dashboard/automation"],
  ["Reports", "/dashboard/reports"],
  ["Settings", "/dashboard/settings"]
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const s = await getSession();
  if (!s) redirect("/login");
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-zinc-200 bg-white p-4 md:flex">
        <Link href="/dashboard" className="px-2 text-xl font-bold">Velora</Link>
        <p className="px-2 text-xs text-zinc-500">Growth OS · Phase 1 skeleton</p>
        <nav className="mt-6 space-y-1">
          {NAV.map(([label, href]) => (
            <Link key={href} href={href} className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100">
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-1 px-2 pt-6 text-xs">
          <Link href="/onboarding" className="font-semibold text-zinc-700 underline">Resume onboarding</Link>
        </div>
      </aside>
      <div className="flex-1">
        <header className="flex items-center gap-2 overflow-x-auto border-b border-zinc-200 bg-white px-4 py-3 md:hidden">
          {NAV.map(([label, href]) => (
            <Link key={href} href={href} className="whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold">{label}</Link>
          ))}
        </header>
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">{children}</div>
      </div>
    </div>
  );
}
