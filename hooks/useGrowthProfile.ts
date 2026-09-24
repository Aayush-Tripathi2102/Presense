"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export function useGrowthProfile() {
  return useQuery({
    queryKey: ["growth-profile"],
    queryFn: () => api<{ profile: Record<string, unknown> }>("/api/profile")
  });
}
