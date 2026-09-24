import { ModuleShell } from "@/components/ModuleShell";

export default function SeoAuditPage() {
  return <ModuleShell title="SEO / Site Audit" desc="Technical + on-page audit skeleton with loading, empty, error and mock states."
    emptyTitle="No audits yet" body={["Indexability & canonicals", "Headings, metas & schema", "Speed & Core Web Vitals", "Broken links & duplicates"]} />;
}
