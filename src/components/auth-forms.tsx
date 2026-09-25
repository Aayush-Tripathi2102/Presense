"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function Shell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card w-full max-w-md p-8">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">T</div>
          <span className="font-semibold">Taro</span>
        </div>
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="mb-6 mt-1 text-sm text-slate-600">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}

export function LoginForm() {
  const r = useRouter();
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <Shell title="Welcome back" subtitle="Log in to your Taro workspace.">
      <form className="space-y-4" onSubmit={async (e) => {
        e.preventDefault(); setErr(""); setLoading(true);
        const fd = new FormData(e.currentTarget as HTMLFormElement);
        const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: fd.get("email"), password: fd.get("password") }) });
        setLoading(false);
        if (res.ok) r.push("/dashboard");
        else setErr((await res.json()).error ?? "Login failed");
      }}>
        <div><label className="label">Email</label><input name="email" type="email" required className="input" /></div>
        <div><label className="label">Password</label><input name="password" type="password" required className="input" /></div>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button className="btn-primary w-full" disabled={loading}>{loading ? "Logging in…" : "Log in"}</button>
        <div className="flex justify-between text-sm">
          <Link href="/signup" className="text-blue-600">Create account</Link>
          <Link href="/forgot-password" className="text-blue-600">Forgot password?</Link>
        </div>
      </form>
    </Shell>
  );
}

export function SignupForm() {
  const r = useRouter();
  const [err, setErr] = useState("");
  return (
    <Shell title="Create your Taro account" subtitle="No ad accounts or integrations needed to start.">
      <form className="space-y-4" onSubmit={async (e) => {
        e.preventDefault(); setErr("");
        const fd = new FormData(e.currentTarget as HTMLFormElement);
        const res = await fetch("/api/auth/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: fd.get("name"), email: fd.get("email"), password: fd.get("password") }) });
        const data = await res.json();
        if (res.ok) r.push(`/verify?token=${data.verifyToken}`);
        else setErr(data.error ?? "Signup failed");
      }}>
        <div><label className="label">Name</label><input name="name" required className="input" /></div>
        <div><label className="label">Email</label><input name="email" type="email" required className="input" /></div>
        <div><label className="label">Password (min 8 chars)</label><input name="password" type="password" required minLength={8} className="input" /></div>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button className="btn-primary w-full">Create account</button>
        <p className="text-sm">Have an account? <Link href="/login" className="text-blue-600">Log in</Link></p>
      </form>
    </Shell>
  );
}

export function ForgotForm() {
  const [done, setDone] = useState(false);
  return (
    <Shell title="Reset password" subtitle="We'll email you a reset link.">
      {done ? <p className="text-sm text-green-700">If the email exists, a reset was initiated.</p> : (
        <form className="space-y-4" onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget as HTMLFormElement);
          await fetch("/api/auth/password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: fd.get("email") }) });
          setDone(true);
        }}>
          <div><label className="label">Email</label><input name="email" type="email" required className="input" /></div>
          <button className="btn-primary w-full">Send reset link</button>
        </form>
      )}
    </Shell>
  );
}
