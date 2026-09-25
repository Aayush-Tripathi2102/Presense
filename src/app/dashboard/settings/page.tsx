"use client";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [orgs, setOrgs] = useState<any[]>([]);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [name, setName] = useState("");
  useEffect(() => {
    fetch("/api/organizations").then((r) => r.json()).then((d) => setOrgs(d.organizations ?? [])).catch(() => {});
    fetch("/api/workspaces").then((r) => r.json()).then((d) => setWorkspaces(d.workspaces ?? [])).catch(() => {});
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="font-semibold">Organizations</h2>
          {orgs.map((o: any) => <p key={o.id} className="mt-1 text-sm">{o.name} <span className="text-slate-500">({o.role})</span></p>)}
          <form className="mt-3 flex gap-2" onSubmit={async (e) => {
            e.preventDefault();
            const res = await fetch("/api/organizations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
            if (res.ok) location.reload();
          }}>
            <input className="input" placeholder="New business name" value={name} onChange={(e) => setName(e.target.value)} />
            <button className="btn-primary">Add</button>
          </form>
        </div>
        <div className="card p-5">
          <h2 className="font-semibold">Workspaces / Projects</h2>
          {workspaces.map((w: any) => <p key={w.id} className="mt-1 text-sm">{w.name} <span className="text-slate-500">({w.organization?.name})</span></p>)}
        </div>
      </div>
    </div>
  );
}
