"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CommandPalette } from "@/components/search";

interface Svc { slug: string; name: string; category: string; status: string; }

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [services, setServices] = useState<Svc[]>([]);
  const [palette, setPalette] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/services").then((r) => r.json()).then((d) => setServices(d.services ?? [])).catch(() => {});
  }, []);

  const byCat = new Map<string, Svc[]>();
  for (const s of services as Svc[]) {
    if (!byCat.has(s.category)) byCat.set(s.category, []);
    byCat.get(s.category)!.push(s);
  }

  return (
    <div className="min-h-screen">
      {palette && <CommandPalette />}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-4 px-4 py-2.5">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-sm font-bold text-white">T</div>
            <span className="font-semibold">Taro</span>
          </Link>
          <button className="input max-w-md text-left text-slate-500" onClick={() => setPalette((v) => !v)}>
            Search services… (Ctrl+K)
          </button>
          <div className="ml-auto flex gap-2">
            <Link href="/dashboard/activity" className="btn-secondary text-xs">Activity</Link>
            <button className="btn-secondary text-xs" onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/login"); }}>Logout</button>
          </div>
        </div>
      </header>
      <div className="flex">
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-3 md:block" style={{ minHeight: "calc(100vh - 53px)" }}>
          <SideLink href="/dashboard" label="Overview" active={pathname === "/dashboard"} />
          <SideLink href="/dashboard/services" label="Services" active={pathname === "/dashboard/services"} />
          {(Array.from(byCat.entries()) as [string, Svc[]][]).map(([cat, list]) => (
            <div key={cat} className="mt-3">
              <p className="px-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{cat}</p>
              {list.map((s) => (
                <SideLink key={s.slug} href={`/dashboard/services/${s.slug}`} label={s.name} active={pathname === `/dashboard/services/${s.slug}`} />
              ))}
            </div>
          ))}
          <div className="mt-3 border-t border-slate-100 pt-3">
            <SideLink href="/dashboard/integrations" label="Integrations" active={pathname === "/dashboard/integrations"} />
            <SideLink href="/dashboard/settings" label="Settings" active={pathname === "/dashboard/settings"} />
          </div>
        </aside>
        <main className="min-w-0 flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

function SideLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link href={href} className={`block truncate rounded-lg px-2 py-1.5 text-sm ${active ? "bg-blue-50 font-medium text-blue-700" : "text-slate-700 hover:bg-slate-100"}`}>
      {label}
    </Link>
  );
}
