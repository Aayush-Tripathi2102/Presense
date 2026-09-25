import type { MarketingServiceDefinition } from "@/services/registry/types";

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    coming_soon: "bg-amber-50 text-amber-700 border-amber-200",
    beta: "bg-blue-50 text-blue-700 border-blue-200",
    active: "bg-green-50 text-green-700 border-green-200",
    deprecated: "bg-slate-100 text-slate-500 border-slate-200",
  };
  return (
    <span className={`badge border ${map[status] ?? map.coming_soon}`}>
      {status.replace("_", " ").toUpperCase()}
    </span>
  );
}

export function ServiceCard({ service }: { service: MarketingServiceDefinition }) {
  return (
    <div className="card flex flex-col p-5">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-lg text-white">
          {service.name.charAt(0)}
        </div>
        <StatusBadge status={service.status} />
      </div>
      <h3 className="mt-3 font-semibold">{service.name}</h3>
      <p className="text-xs uppercase tracking-wide text-slate-500">{service.category}</p>
      <p className="mt-2 flex-1 text-sm text-slate-600">{service.description}</p>
      <a href={`/dashboard/services/${service.slug}`} className="btn-secondary mt-4 w-full">Open</a>
    </div>
  );
}

export function ComingSoonService({ name, description, features, category }: {
  name: string; description: string; features: string[]; category: string;
}) {
  return (
    <div className="mx-auto max-w-2xl py-10 text-center">
      <p className="badge bg-slate-100 text-slate-600">{category}</p>
      <h1 className="mt-3 text-3xl font-bold">{name}</h1>
      <p className="mt-2 text-slate-600">{description}</p>
      <div className="my-6 border-t border-slate-200" />
      <div className="card mx-auto max-w-md p-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-2xl">◷</div>
        <h2 className="mt-4 text-xl font-semibold">Coming Soon</h2>
        <p className="mt-1 text-sm text-slate-600">We&apos;re building the {name} engine for Taro.</p>
        <ul className="mt-5 space-y-2 text-left text-sm">
          {features.map((f) => (
            <li key={f} className="flex gap-2"><span className="text-green-600">✓</span>{f}</li>
          ))}
        </ul>
        <NotifyButton service={name} />
      </div>
    </div>
  );
}

function NotifyButton({ service }: { service: string }) {
  return (
    <button
      className="btn-primary mt-6 w-full"
      onClick={() => alert(`You're on the waitlist for ${service}. We'll notify you.`)}
    >
      Notify Me
    </button>
  );
}

/** Shared service shell — routes render through this, never per-service if/else. */
export function ServicePage({ service, children }: { service: MarketingServiceDefinition; children?: React.ReactNode }) {
  if (service.status === "coming_soon") {
    return (
      <ComingSoonService
        name={service.name}
        description={service.description}
        features={service.highlights}
        category={service.category}
      />
    );
  }
  return <div>{children}</div>;
}
