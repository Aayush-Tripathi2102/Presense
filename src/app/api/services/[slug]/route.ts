import { NextResponse } from "next/server";
import { ServiceRegistry } from "@/services/registry";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = ServiceRegistry.get(slug);
  if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });
  return NextResponse.json({ service });
}
