"use client";
import { useEffect, useState } from "react";

export default function ActivityPage() {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    fetch("/api/notifications").then((r) => r.json()).then(setData).catch(() => {});
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-bold">Activity</h1>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="font-semibold">Notifications</h2>
          {(data?.notifications ?? []).length === 0 && <p className="mt-2 text-sm text-slate-500">No notifications yet. Services will post here (e.g. “SEO audit completed”).</p>}
          {(data?.notifications ?? []).map((n: any) => (
            <div key={n.id} className="mt-2 border-t border-slate-100 pt-2 text-sm"><strong>{n.title}</strong><p className="text-slate-600">{n.body}</p></div>
          ))}
        </div>
        <div className="card p-5">
          <h2 className="font-semibold">Audit log</h2>
          {(data?.auditLogs ?? []).length === 0 && <p className="mt-2 text-sm text-slate-500">No events yet.</p>}
          {(data?.auditLogs ?? []).map((l: any) => (
            <div key={l.id} className="mt-2 border-t border-slate-100 pt-2 text-sm"><code className="rounded bg-slate-100 px-1">{l.action}</code><span className="ml-2 text-slate-500">{new Date(l.createdAt).toLocaleString()}</span></div>
          ))}
        </div>
      </div>
    </div>
  );
}
