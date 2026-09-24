"use client";
import { useState } from "react";

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) }
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error?.message ?? `Request failed: ${path}`);
  return json.data as T;
}

export function useAsync<T>(fn: () => Promise<T>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const run = async () => {
    setLoading(true);
    setError(null);
    try {
      return await fn();
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };
  return { run, loading, error };
}
