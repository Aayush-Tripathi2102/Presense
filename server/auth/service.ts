import { store } from "@/server/db/store";
import { hashPassword, verifyPassword } from "./password";

export async function signup(input: { email: string; password: string; name?: string; orgName?: string }) {
  const email = input.email.toLowerCase().trim();
  const existing = await store.find("users", (u) => u.email === email);
  if (existing) throw Object.assign(new Error("Email already registered"), { status: 409 });

  const user = await store.insert("users", {
    email,
    name: input.name ?? "",
    passwordHash: await hashPassword(input.password)
  });
  const slug = `${email.split("@")[0].replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-${user.id.slice(0, 6)}`;
  const org = await store.insert("organizations", {
    name: input.orgName || `${input.name || email.split("@")[0]}'s Organization`,
    slug
  });
  await store.insert("organization_members", { organizationId: org.id, userId: user.id, role: "owner" });
  await store.insert("onboarding_progress", {
    organizationId: org.id,
    currentStep: 1,
    completedSteps: [],
    steps: {}
  });
  return { user, org };
}

export async function login(input: { email: string; password: string }) {
  const email = input.email.toLowerCase().trim();
  const user = await store.find("users", (u) => u.email === email);
  if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
    throw Object.assign(new Error("Invalid email or password"), { status: 401 });
  }
  const membership = await store.find("organization_members", (m) => m.userId === user.id);
  if (!membership) throw Object.assign(new Error("No organization found for user"), { status: 404 });
  const org = await store.find("organizations", (o) => o.id === membership.organizationId);
  return { user, org };
}

export async function assertOrgAccess(userId: string, orgId: string) {
  const m = await store.find(
    "organization_members",
    (x) => x.userId === userId && x.organizationId === orgId
  );
  if (!m) throw Object.assign(new Error("FORBIDDEN"), { status: 403 });
  return m;
}
