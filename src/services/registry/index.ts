import { SERVICE_CATALOGUE } from "./catalogue";
import type { MarketingServiceDefinition, ServiceCategoryId } from "./types";

/** Central ServiceRegistry — the single source of truth. No hardcoded if/else. */
class Registry {
  private services = new Map<string, MarketingServiceDefinition>();

  constructor() {
    for (const s of SERVICE_CATALOGUE) this.services.set(s.slug, s);
  }

  register(def: MarketingServiceDefinition) {
    if (this.services.has(def.slug)) throw new Error(`Service already registered: ${def.slug}`);
    this.services.set(def.slug, def);
  }

  all(): MarketingServiceDefinition[] { return Array.from(this.services.values()); }
  get(slug: string): MarketingServiceDefinition | undefined { return this.services.get(slug); }
  byCategory(cat: ServiceCategoryId): MarketingServiceDefinition[] {
    return this.all().filter((s) => s.category === cat);
  }
  search(q: string): MarketingServiceDefinition[] {
    const needle = q.toLowerCase();
    return this.all().filter((s) =>
      [s.name, s.slug, s.description, s.category].join(" ").toLowerCase().includes(needle));
  }
}

export const ServiceRegistry = new Registry();
