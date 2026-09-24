"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { Button, Card, Field, Input } from "@/components/ui";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const { register, handleSubmit } = useForm<Record<string, string>>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <Card>
        <h1 className="text-2xl font-bold">{mode === "login" ? "Welcome back" : "Create your workspace"}</h1>
        <p className="mt-1 text-sm text-zinc-600">
          {mode === "login" ? "Log in to your growth OS." : "Auth, organization + resumable onboarding included."}
        </p>
        <form
          className="mt-6 space-y-4"
          onSubmit={handleSubmit(async (v) => {
            setLoading(true); setError(null);
            try {
              await api(mode === "login" ? "/api/auth/login" : "/api/auth/signup", {
                method: "POST", body: JSON.stringify(v)
              });
              router.push("/onboarding");
              router.refresh();
            } catch (e: any) {
              setError(e.message);
            } finally {
              setLoading(false);
            }
          })}
        >
          {mode === "signup" && (
            <Field label="Name"><Input {...register("name")} placeholder="Ada Lovelace" /></Field>
          )}
          <Field label="Email"><Input {...register("email")} type="email" required placeholder="you@company.com" /></Field>
          <Field label="Password"><Input {...register("password")} type="password" required minLength={8} placeholder="Min. 8 characters" /></Field>
          {mode === "signup" && (
            <Field label="Organization"><Input {...register("orgName")} placeholder="Acme Inc." /></Field>
          )}
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <Button disabled={loading} className="w-full">{loading ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}</Button>
        </form>
        <p className="mt-4 text-center text-sm text-zinc-600">
          {mode === "login" ? (
            <>No account? <a className="font-semibold underline" href="/signup">Sign up</a></>
          ) : (
            <>Have an account? <a className="font-semibold underline" href="/login">Log in</a></>
          )}
        </p>
      </Card>
    </main>
  );
}
