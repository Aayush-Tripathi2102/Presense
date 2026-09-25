"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function VerifyInner() {
  const sp = useSearchParams();
  const [msg, setMsg] = useState("");
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card w-full max-w-md space-y-4 p-8">
        <h1 className="text-xl font-semibold">Verify your email</h1>
        <p className="text-sm text-slate-600">Token: <code className="rounded bg-slate-100 px-1">{sp.get("token") ?? "(from signup)"}</code></p>
        <button className="btn-primary w-full" onClick={async () => {
          const res = await fetch("/api/auth/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: sp.get("token") }) });
          setMsg(res.ok ? "Verified! You can now use your dashboard." : "Invalid token");
        }}>Verify email</button>
        {msg && <p className="text-sm text-slate-700">{msg}</p>}
        <Link href="/dashboard" className="btn-secondary w-full">Go to dashboard</Link>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return <Suspense><VerifyInner /></Suspense>;
}
