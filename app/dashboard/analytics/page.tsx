import { ModuleShell } from "@/components/ModuleShell";

export default function AnalyticsPage() {
  return <ModuleShell title="Analytics" desc="GA4, Search Console, social and ads metrics unify here once OAuth connects."
    emptyTitle="Connect Google Analytics" body={["Sessions & users", "Traffic by channel", "Conversions & revenue", "Search queries & pages"]} />;
}
