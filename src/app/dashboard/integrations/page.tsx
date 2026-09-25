"use client";
import { useEffect, useState } from "react";

export default function IntegrationsPage() {
  const [data, setData] = useState<any>(null);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/integrations").then((r) => r.json()).then(setData).catch(() => {});
    fetch("/api/workspaces").then((r) => r.json()).then((d) => setWorkspaces(d.workspaces ?? [])).catch(() => {});
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-bold">Integrations</h1>
      <p className="text-sm text-slate-600">Services request integrations through this common layer — no per-service OAuth code.</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(data?.catalogue ?? []).map((i: any) => (
          <div key={i.slug} className="card p-5">
            <p className="text-xs uppercase text-slate-500">{i.provider}</p>
            <h3 className="font-semibold">{i.name}</h3>
            <p className="mt-1 text-sm text-slate-600">{i.description}</p>
            <button className="btn-secondary mt-3 w-full" onClick={async () => {
              if (!workspaces[0]) { alert("No workspace yet"); return; }
              await fetch("/api/integrations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ workspaceId: workspaces[0].id, integrationSlug: i.slug }) });
              alert(`${i.name} connection recorded (stub)`);
            }}>Connect</button>
          </div>
        ))}
      </div>
    </div>
  );
}
