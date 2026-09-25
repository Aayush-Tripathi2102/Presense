import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "dev-secret-change-in-production-min-32-chars"
);
const COOKIE = "taro_session";

export interface Session { userId: string; email: string; }

export async function createSession(s: Session): Promise<string> {
  return new SignJWT({ ...s })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return { userId: String(payload.userId), email: String(payload.email) };
  } catch { return null; }
}

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function getCurrentUser() {
  const s = await getSession();
  if (!s) return null;
  return db.user.findUnique({ where: { id: s.userId } });
}

export async function setSessionCookie(token: string) {
  const store = await cookies();
  store.set(COOKIE, token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
}
export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function requireUser() {
  const u = await getCurrentUser();
  if (!u) throw new Error("UNAUTHORIZED");
  return u;
}
