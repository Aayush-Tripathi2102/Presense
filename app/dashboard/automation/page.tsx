import { ModuleShell } from "@/components/ModuleShell";

export default function AutomationPage() {
  return <ModuleShell title="Automation" desc="Triggers + actions over the Growth Profile. Runs are background jobs with status and retries."
    emptyTitle="Create your first automation" body={["E.g. new post → cross-post drafts", "Rank drop → alert + brief", "Review → draft response"]} />;
}
