"use client";
import { useEffect, useState } from "react";
import { ServiceCard } from "@/components/services";

export default function CataloguePage() {
  const [services, setServices] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  useEffect(() => {
    fetch("/api/services").then((r) => r.json()).then((d) => setServices(d.services ?? [])).catch(() => {});
  }, []);
  const cats = ["all", ...Array.from(new Set(services.map((s) => s.category)))];
  const filtered = services.filter((s) =>
    (cat === "all" || s.category === cat) &&
    (s.name + s.description + s.slug).toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <h1 className="text-2xl font-bold">Service catalogue</h1>
      <p className="text-sm text-slate-600">Generated automatically from the Service Registry.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <input className="input max-w-xs" placeholder="Filter services…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input max-w-xs" value={cat} onChange={(e) => setCat(e.target.value)}>
          {cats.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => <ServiceCard key={s.slug} service={s} />)}
      </div>
    </div>
  );
}
