export type OrgRole = "owner" | "admin" | "member" | "viewer";
const RANK: Record<OrgRole, number> = { viewer: 0, member: 1, admin: 2, owner: 3 };

export function hasOrgRole(userRole: string | undefined, minimum: OrgRole): boolean {
  const r = (userRole ?? "viewer") as OrgRole;
  return (RANK[r] ?? 0) >= RANK[minimum];
}

/** Future per-service permission, e.g. `seo.manage`. Foundation only. */
export function servicePermission(serviceSlug: string, action: "view" | "manage"): string {
  return `${serviceSlug.replace(/-/g, "_")}.${action}`;
}

export function canAccessService(_role: string | undefined, _serviceSlug: string): boolean {
  return true; // catalogue visible to all org members; per-service grants land here later
}
