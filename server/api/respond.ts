import { NextResponse } from "next/server";
import { err } from "@/lib/utils";

export function apiError(e: unknown) {
  const status = (e as any)?.status ?? 500;
  const message = (e as any)?.message ?? "Internal error";
  console.error(JSON.stringify({ level: "error", message, status }));
  return NextResponse.json(err("ERROR", message), { status });
}

export function apiOk<T>(data: T, status = 200) {
  return NextResponse.json({ ok: true, data }, { status });
}
