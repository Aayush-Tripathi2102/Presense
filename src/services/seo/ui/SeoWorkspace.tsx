"use client";

import { useCallback, useEffect, useState } from "react";

type Tab = "overview" | "audits" | "business" | "roadmap";

interface Site { id: string; domain: string; url: string; latestAudit: { id: string; status: string; health: number | null; startedAt: string } | null; }
interface Issue { id: string; ruleId: string; category: string; severity: string; status: string; pageId: string | null; message: string; evidence: unknown; recommendation: string; }
interface PageRow { id: string; url: string; statusCode: number; title: string | null; wordCount: number; loadMs: number; facts: Record<string, unknown>; }
interface AuditDetail {
  audit: { id: string; status: string; health: number | null; stats: Record<string, unknown>; agents: { agent: string; status: string; summary: string }[]; startedAt: string; finishedAt: string | null; site: Site };
  pages: PageRow[]; issues: Issue[];
}

const SEV_STYLE: Record<string, string> = {
  critical: "bg-red-50 text-red-700 border-red-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-slate-100 text-slate-600 border-slate-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
};

async function api(path: string, init?: RequestInit) {
  const r = await fetch(path, init);
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error ?? "Request failed");
  return d;
}

export function SeoWorkspace() {
  const [workspaceId, setWorkspaceId] = useState("");
  const [sites, setSites] = useState<Site[]>([]);
  const [siteId, setSiteId] = useState("");
  const [tab, setTab] = useState<Tab>("overview");
  const [detail, setDetail] = useState<AuditDetail | null>(null);
  const [history, setHistory] = useState<{ id: string; status: string; health: number | null; startedAt: string }[]>([]);
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");
  const [url, setUrl] = useState("");

  const loadSites = useCallback(async (ws: string) => {
    const d = await api(`/api/services/seo/sites?workspaceId=${ws}`);
    setSites(d.sites);
    if (d.sites.length && !siteId) setSiteId(d.sites[0].id);
  }, [siteId]);

  useEffect(() => {
    api("/api/workspaces").then((d) => {
      if (d.workspaces?.length) { setWorkspaceId(d.workspaces[0].id); void loadSites(d.workspaces[0].id); }
    }).catch((e) => setErr(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!siteId) return;
    api(`/api/services/seo/audits?siteId=${siteId}`).then((d) => {
      setHistory(d.audits);
      const latest = d.audits.find((a: { status: string }) => a.status === "complete");
      if (latest) api(`/api/services/seo/audits/${latest.id}`).then(setDetail).catch(() => {});
      else setDetail(null);
    }).catch(() => {});
  }, [siteId]);

  const site = sites.find((s) => s.id === siteId);

  async function registerSite(e: React.FormEvent) {
    e.preventDefault(); setErr(""); setBusy("register");
    try {
      const fd = new FormData(e.target as HTMLFormElement);
      const d = await api("/api/services/seo/sites", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId, url, businessName: fd.get("businessName"), country: fd.get("country"), offering: fd.get("offering"), language: "en", outcome: "enquiries" }),
      });
      await loadSites(workspaceId); setSiteId(d.site.id); setUrl("");
    } catch (e) { setErr(e instanceof Error ? e.message : "Failed"); }
    finally { setBusy(""); }
  }

  async function runAudit() {
    setErr(""); setBusy("audit");
    try {
      const d = await api("/api/services/seo/audits", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ siteId }),
      });
      const full = await api(`/api/services/seo/audits/${d.auditId}`);
      setDetail(full);
      const h = await api(`/api/services/seo/audits?siteId=${siteId}`);
      setHistory(h.audits); await loadSites(workspaceId);
    } catch (e) { setErr(e instanceof Error ? e.message : "Audit failed"); }
    finally { setBusy(""); }
  }

  return (
    <div className="mt-4">
      {err && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}
      <div className="flex flex-wrap items-center gap-2">
        {(["overview", "audits", "business", "roadmap"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${tab === t ? "bg-slate-900 text-white" : "bg-white text-slate-700 border border-slate-300"}`}>
            {t === "overview" ? "Overview" : t === "audits" ? "Audits & Issues" : t === "business" ? "Business Profile" : "Roadmap"}
          </button>
        ))}
        <select className="input ml-auto max-w-xs" value={siteId} onChange={(e) => setSiteId(e.target.value)}>
          <option value="">Select site…</option>
          {sites.map((s) => <option key={s.id} value={s.id}>{s.domain}</option>)}
        </select>
      </div>

      {tab === "overview" && (
        <div className="mt-4">
          {!site ? (
            <form onSubmit={registerSite} className="card max-w-lg space-y-3 p-5">
              <h2 className="font-semibold">Audit your first site — free, no integrations needed</h2>
              <div><label className="label">Website URL *</label><input className="input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" required /></div>
              <div><label className="label">Business name</label><input name="businessName" className="input" /></div>
              <div><label className="label">Country / region</label><input name="country" className="input" placeholder="IN" /></div>
              <div><label className="label">Principal offering</label><input name="offering" className="input" placeholder="e.g. B2B brand strategy" /></div>
              <button className="btn-primary" disabled={busy === "register"}>{busy === "register" ? "Registering…" : "Register site"}</button>
            </form>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="card p-5"><p className="text-xs uppercase text-slate-500">Site health (heuristic)</p>
                  <p className="text-3xl font-bold">{detail?.audit.health ?? site.latestAudit?.health ?? "—"}</p>
                  <p className="mt-1 text-xs text-slate-500">100 − Σ severity weights × spread. Triage aid, not a ranking prediction.</p></div>
                <div className="card p-5"><p className="text-xs uppercase text-slate-500">Pages crawled</p>
                  <p className="text-3xl font-bold">{(detail?.audit.stats.pagesCrawled as number) ?? "—"}</p>
                  <p className="mt-1 text-xs text-slate-500">Bounded same-origin crawl, robots-respected.</p></div>
                <div className="card p-5"><p className="text-xs uppercase text-slate-500">Open findings</p>
                  <p className="text-3xl font-bold">{detail ? detail.issues.length : "—"}</p>
                  <button className="btn-primary mt-2" onClick={runAudit} disabled={busy === "audit"}>{busy === "audit" ? "Auditing… (up to ~2 min)" : "Run new audit"}</button></div>
              </div>
              {detail && (
                <div className="card mt-4 p-5">
                  <h3 className="font-semibold">Agent pipeline</h3>
                  <div className="mt-2 space-y-2">
                    {detail.audit.agents.map((a) => (
                      <div key={a.agent} className="flex gap-3 text-sm">
                        <span className={`badge border ${a.status === "complete" ? "bg-green-50 text-green-700 border-green-200" : a.status === "needs_data" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>{a.status.replace("_", " ")}</span>
                        <div><strong>{a.agent}</strong><p className="text-slate-600">{a.summary}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {tab === "audits" && (
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <div className="card p-4">
            <h3 className="font-semibold">History</h3>
            {history.map((h) => (
              <button key={h.id} className="mt-2 block w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-sm hover:bg-slate-50"
                onClick={() => api(`/api/services/seo/audits/${h.id}`).then(setDetail).catch((e) => setErr(e.message))}>
                <span className="font-medium">Health {h.health ?? "—"}</span>
                <span className="ml-2 text-slate-500">{h.status} · {new Date(h.startedAt).toLocaleString()}</span>
              </button>
            ))}
            {!history.length && <p className="mt-2 text-sm text-slate-500">No audits yet.</p>}
          </div>
          <div className="lg:col-span-2">
            {!detail ? <p className="text-sm text-slate-500">Select an audit to inspect issues and evidence.</p> : (
              <>
                <h3 className="font-semibold">Findings ({detail.issues.length}) — {detail.audit.site.domain}</h3>
                <div className="mt-2 space-y-2">
                  {detail.issues.map((i) => (
                    <details key={i.id} className="card px-4 py-3">
                      <summary className="cursor-pointer text-sm">
                        <span className={`badge border ${SEV_STYLE[i.severity] ?? SEV_STYLE.info}`}>{i.severity}</span>
                        <span className="ml-2 rounded bg-slate-100 px-1 text-xs">{i.status}</span>
                        <span className="ml-2 font-medium">{i.ruleId}</span>
                        <span className="ml-2 text-slate-600">{i.message}</span>
                      </summary>
                      <div className="mt-2 text-sm">
                        {i.pageId && <p className="text-slate-500">Page: {detail.pages.find((p) => p.id === i.pageId)?.url}</p>}
                        <p className="mt-1"><strong>Recommendation:</strong> {i.recommendation}</p>
                        <pre className="mt-2 overflow-auto rounded bg-slate-900 p-2 text-xs text-slate-100">{JSON.stringify(i.evidence, null, 2)}</pre>
                      </div>
                    </details>
                  ))}
                </div>
                <h3 className="mt-6 font-semibold">Pages ({detail.pages.length})</h3>
                <div className="card mt-2 overflow-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                      <th className="px-3 py-2">URL</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Title</th><th className="px-3 py-2">Words</th><th className="px-3 py-2">Load</th>
                    </tr></thead>
                    <tbody>
                      {detail.pages.map((p) => (
                        <tr key={p.id} className="border-b border-slate-100">
                          <td className="max-w-xs truncate px-3 py-1.5">{p.url}</td>
                          <td className="px-3 py-1.5">{p.statusCode}</td>
                          <td className="max-w-xs truncate px-3 py-1.5">{p.title ?? "—"}</td>
                          <td className="px-3 py-1.5">{p.wordCount}</td>
                          <td className="px-3 py-1.5">{p.loadMs}ms</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {tab === "business" && site && <BusinessTab siteId={site.id} />}
      {tab === "roadmap" && <RoadmapTab />}
    </div>
  );
}

function BusinessTab({ siteId }: { siteId: string }) {
  const [versions, setVersions] = useState<{ version: number; profile: Record<string, string>; createdAt: string }[]>([]);
  const [msg, setMsg] = useState("");
  const load = useCallback(() => {
    api(`/api/services/seo/profile?siteId=${siteId}`).then((d) => setVersions(d.versions)).catch(() => {});
  }, [siteId]);
  useEffect(load, [load]);
  const latest = versions[0]?.profile ?? {};
  return (
    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      <form className="card space-y-3 p-5" onSubmit={async (e) => {
        e.preventDefault(); setMsg("");
        const fd = new FormData(e.target as HTMLFormElement);
        const profile: Record<string, string> = {};
        ["businessName", "country", "offering", "language", "outcome", "offerings", "idealCustomers", "competitors", "successTarget"].forEach((k) => {
          const v = String(fd.get(k) ?? "").trim(); if (v) profile[k] = v;
        });
        try { const d = await api("/api/services/seo/profile", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ siteId, profile }) }); setMsg(`Saved as version ${d.version}.`); load(); }
        catch (err) { setMsg(err instanceof Error ? err.message : "Failed"); }
      }}>
        <h3 className="font-semibold">Business profile (user assertions — versioned, never auto-verified)</h3>
        {[["businessName", "Business name"], ["country", "Country / region"], ["offering", "Principal offering"], ["language", "Preferred language"], ["outcome", "Expected outcome"], ["offerings", "Top 1–3 offerings"], ["idealCustomers", "Ideal customers + disqualifiers"], ["competitors", "Competitors / alternatives"], ["successTarget", "Success target + horizon"]].map(([k, label]) => (
          <div key={k}><label className="label">{label}</label><input name={k} defaultValue={latest[k] ?? ""} className="input" /></div>
        ))}
        <button className="btn-primary">Save new version</button>
        {msg && <p className="text-sm text-slate-600">{msg}</p>}
      </form>
      <div className="card p-5">
        <h3 className="font-semibold">Version history</h3>
        {versions.map((v) => (
          <details key={v.version} className="mt-2 rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <summary className="cursor-pointer">v{v.version} · {new Date(v.createdAt).toLocaleString()}</summary>
            <pre className="mt-2 overflow-auto text-xs">{JSON.stringify(v.profile, null, 2)}</pre>
          </details>
        ))}
        {!versions.length && <p className="mt-2 text-sm text-slate-500">No profile yet.</p>}
      </div>
    </div>
  );
}

function RoadmapTab() {
  const items = [
    { name: "Opportunity queue", desc: "Demand clusters from Search Console + gap analysis, ranked by a transparent business-fit × opportunity ÷ effort heuristic. Needs GSC connection first.", status: "after GSC" },
    { name: "AI visibility panel", desc: "Reproducible 30–50 prompt panel across AI surfaces: mentions, citations, accuracy. Sampled observations, never universal claims.", status: "planned" },
    { name: "Expert inbox", desc: "Private triage of journalist/expert requests with source-rights registry and per-source AI rules. Rights-gated by design.", status: "planned" },
    { name: "Change sets + approvals", desc: "Bounded reversible edits with per-artifact approval, live verification, and rollback. CMS adapters later.", status: "planned" },
  ];
  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      {items.map((i) => (
        <div key={i.name} className="card p-5 opacity-90">
          <div className="flex items-center justify-between"><h3 className="font-semibold">{i.name}</h3>
            <span className="badge border bg-slate-100 text-slate-500 border-slate-200">{i.status.toUpperCase()}</span></div>
          <p className="mt-2 text-sm text-slate-600">{i.desc}</p>
        </div>
      ))}
    </div>
  );
}
