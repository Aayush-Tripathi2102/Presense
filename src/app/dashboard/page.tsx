import { ServiceRegistry } from "@/services/registry";
import { SERVICE_CATEGORIES } from "@/services/registry/types";
import { ServiceCard } from "@/components/services";

export default function OverviewPage() {
  const services = ServiceRegistry.all();
  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-600">{services.length} services · {SERVICE_CATEGORIES.length} categories · all services currently in Coming Soon while the platform stabilizes.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card p-5"><p className="text-xs uppercase text-slate-500">Services</p><p className="text-3xl font-bold">{services.length}</p></div>
        <div className="card p-5"><p className="text-xs uppercase text-slate-500">Categories</p><p className="text-3xl font-bold">{SERVICE_CATEGORIES.length}</p></div>
        <div className="card p-5"><p className="text-xs uppercase text-slate-500">Live</p><p className="text-3xl font-bold">0</p><p className="text-xs text-slate-500">First real service ships after platform phase (SEO).</p></div>
      </div>
      <h2 className="mt-8 font-semibold">Featured services</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {["seo", "google-ads", "instagram", "youtube", "email-marketing", "analytics"].map((slug) => {
          const s = ServiceRegistry.get(slug)!;
          return <ServiceCard key={slug} service={s} />;
        })}
      </div>
    </div>
  );
}
