import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { siteForUser } from "../_guard";

const saveProfile = z.object({
  siteId: z.string().min(1),
  profile: z.object({
    businessName: z.string().max(120).optional(),
    country: z.string().max(32).optional(),
    offering: z.string().max(300).optional(),
    language: z.string().max(16).optional(),
    outcome: z.string().max(64).optional(),
    offerings: z.string().max(1000).optional(),
    idealCustomers: z.string().max(1000).optional(),
    competitors: z.string().max(1000).optional(),
    successTarget: z.string().max(300).optional(),
  }),
});

/** Versioned business profile — user assertions, never silently verified facts. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const gate = await siteForUser(searchParams.get("siteId") ?? "");
  if ("error" in gate) return gate.error;
  const versions = await db.seoBusinessProfile.findMany({
    where: { siteId: gate.site.id }, orderBy: { version: "desc" }, take: 10,
  });
  return NextResponse.json({
    versions: versions.map((v) => ({ ...v, profile: JSON.parse(v.profile) })),
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = saveProfile.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const gate = await siteForUser(parsed.data.siteId);
  if ("error" in gate) return gate.error;
  const count = await db.seoBusinessProfile.count({ where: { siteId: gate.site.id } });
  const saved = await db.seoBusinessProfile.create({
    data: { siteId: gate.site.id, version: count + 1, source: "user", profile: JSON.stringify(parsed.data.profile) },
  });
  return NextResponse.json({ ok: true, version: saved.version });
}
