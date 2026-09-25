import { notFound } from "next/navigation";
import { ServiceRegistry } from "@/services/registry";
import { serviceUiFor } from "@/services/ui-registry";
import { ServicePage, StatusBadge } from "@/components/services";
import { ServiceOnboarding } from "./onboarding";

export default async function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = ServiceRegistry.get(slug);
  if (!service) notFound();
  // Module-owned UI takes precedence (registered in services/ui-registry);
  // all other services fall through to the shared shell + generic onboarding.
  const ModuleUI = serviceUiFor(slug);
  return (
    <div>
      <nav className="text-xs text-slate-500">Dashboard / Services / <strong>{service.name}</strong></nav>
      <div className="mt-2 flex items-center gap-3">
        <h1 className="text-2xl font-bold">{service.name}</h1>
        <StatusBadge status={service.status} />
      </div>
      <p className="mt-1 text-sm text-slate-600">{service.description}</p>
      {ModuleUI ? (
        <ModuleUI />
      ) : (
        <>
          <ServicePage service={service} />
          {service.features.onboarding && <ServiceOnboarding slug={service.slug} />}
        </>
      )}
    </div>
  );
}
