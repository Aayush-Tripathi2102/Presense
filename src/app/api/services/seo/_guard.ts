import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/core/auth/session";
import { rootDomainOf } from "@/services/seo/crawler/fetcher";

/** Resolve a workspace the current user belongs to, else 401/403. */
export async function workspaceForUser(workspaceId: string) {
  const user = await requireUser().catch(() => null);
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) } as const;
  const ws = await db.workspace.findFirst({
    where: { id: workspaceId, organization: { members: { some: { userId: user.id } } } },
  });
  if (!ws) return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) } as const;
  return { user, ws } as const;
}

export async function siteForUser(siteId: string) {
  const user = await requireUser().catch(() => null);
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) } as const;
  const site = await db.seoSite.findFirst({
    where: { id: siteId, workspace: { organization: { members: { some: { userId: user.id } } } } },
  });
  if (!site) return { error: NextResponse.json({ error: "Not found" }, { status: 404 }) } as const;
  return { user, site } as const;
}

export function domainOf(raw: string): string {
  const u = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
  return rootDomainOf(u.toString());
}
