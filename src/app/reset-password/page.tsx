"use client";
import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function ResetInner() {
  const sp = useSearchParams();
  const r = useRouter();
  const [msg, setMsg] = useState("");
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form className="card w-full max-w-md space-y-4 p-8" onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget as HTMLFormElement);
        const res = await fetch("/api/auth/password", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: sp.get("token") ?? fd.get("token"), password: fd.get("password") }) });
        if (res.ok) r.push("/login");
        else setMsg("Token invalid or expired");
      }}>
        <h1 className="text-xl font-semibold">Set a new password</h1>
        <div><label className="label">Reset token</label><input name="token" defaultValue={sp.get("token") ?? ""} className="input" /></div>
        <div><label className="label">New password</label><input name="password" type="password" required minLength={8} className="input" /></div>
        {msg && <p className="text-sm text-red-600">{msg}</p>}
        <button className="btn-primary w-full">Reset password</button>
      </form>
    </div>
  );
}

export default function ResetPage() {
  return <Suspense><ResetInner /></Suspense>;
}
