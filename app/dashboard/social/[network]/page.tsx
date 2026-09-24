import { ModuleShell } from "@/components/ModuleShell";

export default async function NetworkPage({ params }: { params: Promise<{ network: string }> }) {
  const { network } = await params;
  return <ModuleShell title={`Social / ${network}`} desc="Per-channel status, ideas, calendar and queue share the same Growth Profile."
    emptyTitle={`Connect ${network}`}
    body={["Account status: not connected (placeholder)", "Content performance", "Audience & engagement", "Ideas + publishing queue"]} />;
}
