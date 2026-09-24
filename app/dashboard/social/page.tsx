import { ModuleShell } from "@/components/ModuleShell";

const NETWORKS = ["instagram","x","linkedin","youtube","tiktok","facebook"];
export default function SocialPage() {
  return (
    <div className="space-y-6">
      <ModuleShell title="Social" desc="Account status, performance, calendar, queue — real OAuth only, never faked."
        cards={NETWORKS.map((n) => [n[0].toUpperCase() + n.slice(1), "Not connected — OAuth placeholder"] as [string, string])}
        emptyTitle="Connect your first channel" body={["Post performance","Audience growth","Engagement","Publishing queue"]} />
      <div className="grid gap-2 sm:grid-cols-3">
        {NETWORKS.map((n) => (
          <a key={n} href={`/dashboard/social/${n}`} className="rounded-xl border bg-white p-4 text-sm font-semibold hover:bg-zinc-50">Open {n} →</a>
        ))}
      </div>
    </div>
  );
}
