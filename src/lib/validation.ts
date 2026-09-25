import { z } from "zod";
export const signupSchema = z.object({ name: z.string().min(1).max(80), email: z.string().email(), password: z.string().min(8).max(128) });
export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
export const forgotSchema = z.object({ email: z.string().email() });
export const resetSchema = z.object({ token: z.string().min(1), password: z.string().min(8).max(128) });
export const orgSchema = z.object({ name: z.string().min(1).max(80) });
export const workspaceSchema = z.object({ organizationId: z.string().min(1), name: z.string().min(1).max(80), website: z.string().optional() });
export const configSchema = z.object({ workspaceId: z.string().min(1), serviceId: z.string().min(1), configuration: z.record(z.string(), z.unknown()) });
