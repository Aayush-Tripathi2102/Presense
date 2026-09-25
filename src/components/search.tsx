"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/** Global command/search palette — searches registry services + core pages. */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [services, setServices] = useState<{ slug: string; name: string }[]>([]);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((v) => !v); }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) fetch("/api/services").then((r) => r.json()).then((d) => setServices(d.services ?? [])).catch(() => {});
  }, [open ]);

  if (!open) return null;
  const pages = [
    { name: "Overview", href: "/dashboard" },
    { name: "Service catalogue", href: "/dashboard/services" },
    { name: "Integrations", href: "/dashboard/integrations" },
    { name: "Activity", href: "/dashboard/activity" },
    { name: "Settings", href: "/dashboard/settings" },
  ];
  const needle = q.toLowerCase();
  const matchedServices = services.filter((s) => s.name.toLowerCase().includes(needle));
  const matchedPages = pages.filter((p) => p.name.toLowerCase().includes(needle));

  return (
    <div className="fixed inset-0 z-50 bg-black/30 p-4" onClick={() => setOpen(false)}>
      <div className="mx-auto mt-20 max-w-lg overflow-hidden rounded-xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
        <input autoFocus className="w-full border-b border-slate-200 px-4 py-3 text-sm outline-none" placeholder="Search services, settings, workspaces… (Esc to close)" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="max-h-80 overflow-auto p-2 text-sm">
          {matchedPages.map((p) => (
            <button key={p.href} className="block w-full rounded-lg px-3 py-2 text-left hover:bg-slate-100" onClick={() => { setOpen(false); router.push(p.href); }}>{p.name}</button>
          ))}
          {matchedServices.map((s) => (
            <button key={s.slug} className="block w-full rounded-lg px-3 py-2 text-left hover:bg-slate-100" onClick={() => { setOpen(false); router.push(`/dashboard/services/${s.slug}`); }}>{s.name}</button>
          ))}
          {!matchedPages.length && !matchedServices.length && <p className="px-3 py-4 text-slate-500">No results</p>}
        </div>
      </div>
    </div>
  );
}
