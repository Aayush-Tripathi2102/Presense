import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE = "velora_session";

function secret() {
  const s = process.env.SESSION_SECRET ?? "dev-only-secret-change-me-please-123456";
  return new TextEncoder().encode(s);
}

export async function createSession(payload: { userId: string; orgId: string }) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
}

export async function getSession(): Promise<{ userId: string; orgId: string } | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return { userId: String(payload.userId), orgId: String(payload.orgId) };
  } catch {
    return null;
  }
}

export async function destroySession() {
  (await cookies()).set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function requireSession() {
  const s = await getSession();
  if (!s) throw Object.assign(new Error("UNAUTHENTICATED"), { status: 401 });
  return s;
}
