import { MetricCard, Card, AIInsight, ActionCard, EmptyState, MockBadge } from "@/components/ui";
import Link from "next/link";

const METRICS: [string, string, string][] = [
  ["Growth Score", "—", "Connect sources to compute"],
  ["Organic Traffic", "—", "Connect Search Console"],
  ["Search Visibility", "—", "Run rank tracking"],
  ["AI Visibility", "—", "GEO placeholder"],
  ["Social Reach", "—", "Connect a network"],
  ["Engagement", "—", "Connect a network"],
  ["Leads", "—", "Connect analytics"],
  ["Conversions", "—", "Define goals"],
  ["Revenue", "—", "Connect analytics"]
];

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Overview</h1>
          <p className="text-sm text-zinc-600">Every card below is an honest placeholder until its source connects. <MockBadge /></p>
        </div>
        <Link href="/onboarding" className="rounded-lg bg-zinc-950 px-4 py-2 text-sm font-semibold text-white">Open Growth Profile</Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {METRICS.map(([label, value, sub]) => (
          <MetricCard key={label} label={label} value={value} sub={sub} mock />
        ))}
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <AIInsight title="Priority insight" body="Mock insight: connect Search Console + Analytics to generate real priority actions from your Business Growth Profile." />
        <ActionCard title="Priority actions" body="1) Finish onboarding  2) Connect Search Console  3) Run placeholder site audit  4) Draft first content ideas" />
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        <Card><p className="font-semibold">Recent activity</p><p className="mt-1 text-sm text-zinc-600">No events yet — jobs and publishes will appear here.</p></Card>
        <Card><p className="font-semibold">Upcoming content</p><p className="mt-1 text-sm text-zinc-600">Calendar is empty. Ideas created from your profile will queue here.</p></Card>
        <Card><p className="font-semibold">Competitor movement</p><p className="mt-1 text-sm text-zinc-600">Add competitors in onboarding step 7 to enable tracking.</p></Card>
      </div>
      <EmptyState
        title="Connect Google Search Console"
        body={["Search impressions", "Clicks", "CTR", "Average position", "Queries & pages", "Brand vs non-brand performance"]}
        action={<span className="rounded-lg border px-4 py-2 text-sm font-semibold text-zinc-500">Connect Search Console (OAuth in Phase 2)</span>}
      />
    </div>
  );
}
