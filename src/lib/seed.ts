import { db } from "@/lib/db";
import { SERVICE_CATALOGUE } from "@/services/registry/catalogue";
import { INTEGRATION_CATALOGUE } from "@/integrations/catalogue";

export async function seedServices() {
  for (const s of SERVICE_CATALOGUE) {
    await db.service.upsert({
      where: { slug: s.slug },
      update: { name: s.name, description: s.description, category: s.category, icon: s.icon, status: s.status, enabled: s.enabled, features: JSON.stringify(s.features ?? {}) },
      create: { slug: s.slug, name: s.name, description: s.description, category: s.category, icon: s.icon, status: s.status, enabled: s.enabled, features: JSON.stringify(s.features ?? {}) },
    });
  }
  for (const i of INTEGRATION_CATALOGUE) {
    await db.integration.upsert({
      where: { slug: i.slug },
      update: { name: i.name, provider: i.provider, description: i.description },
      create: { slug: i.slug, name: i.name, provider: i.provider, description: i.description },
    });
  }
}
