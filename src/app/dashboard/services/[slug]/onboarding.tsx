"use client";
import { useEffect, useState } from "react";
import { DynamicForm } from "@/components/forms";

export function ServiceOnboarding({ slug }: { slug: string }) {
  const [service, setService] = useState<any>(null);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    fetch(`/api/services/${slug}`).then((r) => r.json()).then((d) => setService(d.service)).catch(() => {});
  }, [slug ]);
  if (!service) return null;
  return (
    <div className="card mt-6 p-5">
      <h2 className="font-semibold">Configure {service.name}</h2>
      <div className="mt-3">
        <DynamicForm fields={service.onboarding?.fields ?? []} onSubmit={async (values) => {
          const ws = await fetch("/api/workspaces").then((r) => r.json()).catch(() => null);
          const workspaceId = ws?.workspaces?.[0]?.id;
          if (!workspaceId) { alert("Create a workspace first"); return; }
          await fetch("/api/service-configs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ workspaceId, serviceId: slug, configuration: values }) });
          setSaved(true);
        }} />
        {saved && <p className="mt-2 text-sm text-green-700">Configuration saved.</p>}
      </div>
    </div>
  );
}
