import { ModuleShell } from "@/components/ModuleShell";

export default function ContentPage() {
  return <ModuleShell title="Content" desc="Ideas, calendar, articles, posts, videos, campaigns, templates — all linked to profile, goal and keywords."
    cards={[["Ideas","Generated from Growth Profile (placeholder)"],["Calendar","Nothing scheduled"],["Brand Voice","Analyzer placeholder"]]}
    emptyTitle="Generate your first ideas" body={["Linked goal, audience & product", "Target keywords", "Approval state", "Publication state"]} />;
}
