import { NextRequest } from "next/server";
import { signupSchema } from "@/lib/validations";
import { signup } from "@/server/auth/service";
import { createSession } from "@/server/auth/session";
import { apiError, apiOk } from "@/server/api/respond";

export async function POST(req: NextRequest) {
  try {
    const body = signupSchema.parse(await req.json());
    const { user, org } = await signup(body);
    await createSession({ userId: user.id, orgId: org.id });
    return apiOk({ user: { id: user.id, email: user.email, name: user.name }, org }, 201);
  } catch (e) {
    return apiError(e);
  }
}
