import { NextRequest } from "next/server";
import { loginSchema } from "@/lib/validations";
import { login } from "@/server/auth/service";
import { createSession } from "@/server/auth/session";
import { apiError, apiOk } from "@/server/api/respond";

export async function POST(req: NextRequest) {
  try {
    const body = loginSchema.parse(await req.json());
    const { user, org } = await login(body);
    await createSession({ userId: user.id, orgId: org.id });
    return apiOk({ user: { id: user.id, email: user.email, name: user.name }, org });
  } catch (e) {
    return apiError(e);
  }
}
