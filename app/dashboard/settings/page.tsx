"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { Card, IntegrationCard } from "@/components/ui";

export default function SettingsPage() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    api<{ integrations: any[] }>("/api/integrations").then((d) => setItems(d.integrations)).catch(() => {});
  }, []);
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Settings & Integrations</h1>
      <p className="text-sm text-zinc-600">OAuth-based. Tokens stay server-side; nothing here is shown as connected until the flow succeeds.</p></div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((i) => (
          <IntegrationCard key={i.key} name={i.label} status={i.status} comingSoon={i.comingSoon}
            onConnect={() => alert(`${i.label}: OAuth not implemented in Phase 1 (placeholder). No fake connection made.)`)} />
        ))}
      </div>
      <Card><p className="font-semibold">Jobs</p><JobsList /></Card>
    </div>
  );
}

function JobsList() {
  const [jobs, setJobs] = useState<any[]>([]);
  useEffect(() => {
    api<{ jobs: any[] }>("/api/jobs").then((d) => setJobs(d.jobs)).catch(() => {});
  }, []);
  if (!jobs.length) return <p className="mt-1 text-sm text-zinc-600">No background jobs yet.</p>;
  return (
    <ul className="mt-2 space-y-1 text-sm">
      {jobs.map((j: any) => <li key={j.id}>• {j.type} — {j.status} ({j.progress}%)</li>)}
    </ul>
  );
}
