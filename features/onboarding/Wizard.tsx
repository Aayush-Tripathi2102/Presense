"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { WIZARD_STEPS } from "./steps";
import { Button, Card, Field, Input, Textarea, Select, ProgressIndicator, MockBadge } from "@/components/ui";

interface Progress {
  currentStep: number;
  completedSteps: number[];
  steps: Record<string, any>;
}

export function OnboardingWizard() {
  const router = useRouter();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [integrations, setIntegrations] = useState<any[]>([]);

  useEffect(() => {
    api<Progress>("/api/onboarding/progress").then((p) => {
      setProgress(p);
      const idx = Math.min(11, Math.max(0, (p.currentStep ?? 1) - 1));
      setStepIdx(idx);
      setForm(p.steps?.[String(idx + 1)] ?? {});
    }).catch(() => router.push("/login"));
    api<{ integrations: any[] }>("/api/integrations").then((d) => setIntegrations(d.integrations)).catch(() => {});
  }, [router]);

  const step = WIZARD_STEPS[stepIdx];
  if (!progress || !step) return <main className="mx-auto max-w-2xl p-8">Loading onboarding…</main>;

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function save(completed: boolean, nextIdx?: number) {
    setSaving(true);
    try {
      const updated = await api<Progress>("/api/onboarding/progress", {
        method: "POST",
        body: JSON.stringify({ step: stepIdx + 1, data: form, completed })
      });
      setProgress(updated);
      if (stepIdx === 5 && form.url) {
        try {
          const r = await api<{ analysis: any }>("/api/onboarding/website/analyze", {
            method: "POST", body: JSON.stringify({ url: form.url })
          });
          setAnalysis(r.analysis);
        } catch {}
      }
      if (typeof nextIdx === "number") {
        setStepIdx(nextIdx);
        setForm(updated.steps?.[String(nextIdx + 1)] ?? {});
        window.scrollTo(0, 0);
      } else if (completed && stepIdx < 11) {
        const n = stepIdx + 1;
        setStepIdx(n);
        setForm(updated.steps?.[String(n + 1)] ?? {});
        window.scrollTo(0, 0);
      }
      if (stepIdx === 11 && completed) router.push("/dashboard");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Velora onboarding — resumable</p>
      <h1 className="mt-1 text-3xl font-bold">{stepIdx + 1}. {step.title}</h1>
      <p className="mt-1 text-zinc-600">{step.subtitle}</p>
      <div className="mt-4"><ProgressIndicator current={stepIdx + 1} total={12} /></div>

      <div className="mt-4 flex flex-wrap gap-2">
        {WIZARD_STEPS.map((s, i) => (
          <button
            key={s.slug}
            onClick={() => { setStepIdx(i); setForm(progress.steps?.[String(i + 1)] ?? {}); }}
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${i === stepIdx ? "border-zinc-950 bg-zinc-950 text-white" : (progress.completedSteps ?? []).includes(i + 1) ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-zinc-300 bg-white"}`}
          >
            {i + 1} {s.title}
          </button>
        ))}
      </div>

      <Card className="mt-6">
        <div className="space-y-4">
          {step.fields.filter((f) => f.type !== "info").map((f) => (
            <Field key={f.key} label={`${f.label}${f.optional ? " (optional)" : ""}`} hint={f.hint}>
              {f.type === "textarea" ? (
                <Textarea rows={3} value={form[f.key] ?? ""} placeholder={f.placeholder} onChange={(e) => set(f.key, e.target.value)} />
              ) : f.type === "select" ? (
                <Select value={form[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)}>
                  <option value="">Select…</option>
                  {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                </Select>
              ) : (
                <Input value={form[f.key] ?? ""} placeholder={f.placeholder} onChange={(e) => set(f.key, e.target.value)} />
              )}
            </Field>
          ))}
          {step.fields.filter((f) => f.type === "info").map((f) => (
            <p key={f.key} className="rounded-lg bg-zinc-50 p-3 text-sm text-zinc-600">{f.hint}</p>
          ))}

          {stepIdx === 5 && analysis && (
            <div className="rounded-lg border border-violet-200 bg-violet-50 p-4 text-sm">
              <div className="flex items-center gap-2 font-semibold">Website analysis <MockBadge /></div>
              <p className="mt-1 text-zinc-700">{analysis.note}</p>
              <p className="mt-1 text-zinc-600">URL: {analysis.url} • Issues: {analysis.issues?.length ?? 0}</p>
            </div>
          )}

          {stepIdx === 10 && integrations.length > 0 && (
            <div className="grid gap-2 sm:grid-cols-2">
              {integrations.slice(0, 8).map((i: any) => (
                <div key={i.key} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                  <span className="font-medium">{i.label}</span>
                  <span className="text-xs text-zinc-500">{i.status.replaceAll("_", " ")}</span>
                </div>
              ))}
            </div>
          )}

          {stepIdx === 11 && (
            <LaunchSummary steps={progress.steps} />
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {stepIdx > 0 && <Button variant="secondary" onClick={() => { const n = stepIdx - 1; setStepIdx(n); setForm(progress.steps?.[String(n + 1)] ?? {}); }}>Back</Button>}
          <Button variant="outline" onClick={() => save(false)} disabled={saving}>Save & continue later</Button>
          {step.skippable && <Button variant="ghost" onClick={() => save(true)}>Skip for now</Button>}
          <Button onClick={() => save(true)} disabled={saving}>{stepIdx === 11 ? "Finish — build my Growth Profile" : "Save & continue"}</Button>
        </div>
      </Card>
    </main>
  );
}

function LaunchSummary({ steps }: { steps: Record<string, any> }) {
  const b = steps?.["1"] ?? {};
  return (
    <div className="rounded-lg bg-zinc-50 p-4 text-sm">
      <p className="font-semibold">Your Growth Profile is ready. <span className="font-normal text-zinc-600">(Deterministic mock analysis until AI provider connects.)</span></p>
      <ul className="mt-2 space-y-1 text-zinc-700">
        <li>• Business: {String(b.businessName ?? "—")} — {String(b.oneLineDescription ?? "")}</li>
        <li>• Website: {String(steps?.["6"]?.url ?? "—")}</li>
        <li>• Primary goal: {String(steps?.["2"]?.primaryGoal ?? "—")}</li>
        <li>• SEO seeds: {String(steps?.["7"]?.keywordSeeds ?? "—")}</li>
      </ul>
    </div>
  );
}
