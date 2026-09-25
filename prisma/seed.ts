import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import { SERVICE_CATALOGUE } from "../src/services/registry/catalogue";
import { INTEGRATION_CATALOGUE } from "../src/integrations/catalogue";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const db = new PrismaClient({ adapter });

async function main() {
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
  console.log("Seeded services + integrations");
}

main().finally(() => db.$disconnect());

export { db };
export async function seedServices() {
  for (const s of SERVICE_CATALOGUE) {
    await db.service.upsert({
      where: { slug: s.slug },
      update: { name: s.name, description: s.description, category: s.category, icon: s.icon, status: s.status, enabled: s.enabled, features: JSON.stringify(s.features ?? {}) },
      create: { slug: s.slug, name: s.name, description: s.description, category: s.category, icon: s.icon, status: s.status, enabled: s.enabled, features: JSON.stringify(s.features ?? {}) },
    });
  }
}
