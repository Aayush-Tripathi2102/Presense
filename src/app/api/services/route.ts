import { NextResponse } from "next/server";
import { ServiceRegistry } from "@/services/registry";
import { SERVICE_CATEGORIES } from "@/services/registry/types";
import { db } from "@/lib/db";
import { seedServices } from "@/lib/seed";

export async function GET() {
  await seedServices().catch(() => {});
  const fromDb = await db.service.findMany().catch(() => []);
  const bySlug = new Map(fromDb.map((s) => [s.slug, s]));
  const services = ServiceRegistry.all().map((s) => ({
    ...s,
    status: bySlug.get(s.slug)?.status ?? s.status,
    enabled: bySlug.get(s.slug)?.enabled ?? s.enabled,
  }));
  return NextResponse.json({ categories: SERVICE_CATEGORIES, services });
}
