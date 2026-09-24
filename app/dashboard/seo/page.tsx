import { ModuleShell } from "@/components/ModuleShell";

export default function SeoPage() {
  return <ModuleShell title="SEO" desc="Overview, audits, keywords, competitors, gaps, backlinks, AI visibility — one service boundary each."
    cards={[["Site health","Placeholder until crawler connects"],["Rankings","Rank tracker placeholder"],["AI visibility","GEO placeholder"]]}
    emptyTitle="Run your first site audit" body={["Crawl status","Issues by severity","On-page gaps","Content opportunities"]} />;
}
