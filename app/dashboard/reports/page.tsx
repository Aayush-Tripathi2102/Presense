import { ModuleShell } from "@/components/ModuleShell";

export default function ReportsPage() {
  return <ModuleShell title="Reports" desc="Scheduled snapshots across SEO, social, content and revenue."
    emptyTitle="No reports yet" body={["Weekly growth digest", "Channel breakdowns", "Goal progress"]} />;
}
