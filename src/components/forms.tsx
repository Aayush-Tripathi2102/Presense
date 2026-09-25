"use client";
import { useState } from "react";
import type { ServiceField } from "@/services/registry/types";

/** Reusable dynamic form engine — driven entirely by a service's onboarding schema. */
export function DynamicForm({ fields, onSubmit }: { fields: ServiceField[]; onSubmit: (values: Record<string, unknown>) => void | Promise<void> }) {
  const [values, setValues] = useState<Record<string, unknown>>({});
  const set = (id: string, v: unknown) => setValues((prev) => ({ ...prev, [id]: v }));

  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); void onSubmit(values); }}>
      {fields.map((f) => (
        <div key={f.id}>
          <label className="label">{f.label}{f.required && " *"}</label>
          {f.description && <p className="mb-1 text-xs text-slate-500">{f.description}</p>}
          <FieldInput field={f} value={values[f.id]} onChange={(v) => set(f.id, v)} />
        </div>
      ))}
      <button className="btn-primary" type="submit">Save configuration</button>
    </form>
  );
}

function FieldInput({ field, value, onChange }: { field: ServiceField; value: unknown; onChange: (v: unknown) => void }) {
  const str = (value as string) ?? "";
  switch (field.type) {
    case "textarea":
      return <textarea className="input" rows={3} placeholder={field.placeholder} value={str} onChange={(e) => onChange(e.target.value)} />;
    case "number":
      return <input className="input" type="number" value={str} onChange={(e) => onChange(e.target.valueAsNumber)} />;
    case "select":
    case "radio":
      return (
        <select className="input" value={str} onChange={(e) => onChange(e.target.value)}>
          <option value="">Select…</option>
          {field.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      );
    case "multiselect":
      return (
        <div className="flex flex-wrap gap-2">
          {field.options?.map((o) => {
            const arr = (Array.isArray(value) ? value : []) as string[];
            const on = arr.includes(o.value);
            return (
              <button type="button" key={o.value}
                className={`rounded-full border px-3 py-1 text-sm ${on ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-300"}`}
                onClick={() => onChange(on ? arr.filter((x) => x !== o.value) : [...arr, o.value])}>
                {o.label}
              </button>
            );
          })}
        </div>
      );
    case "checkbox":
      return <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4" />;
    case "date":
      return <input className="input" type="date" value={str} onChange={(e) => onChange(e.target.value)} />;
    case "integration":
      return (
        <div className="flex items-center justify-between rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm">
          <span>Connect <strong>{field.integration}</strong> (OAuth stub)</span>
          <button type="button" className="btn-secondary" onClick={() => onChange("connected")}>Connect</button>
        </div>
      );
    default:
      return <input className="input" type={field.type === "url" ? "url" : "text"} placeholder={field.placeholder} value={str} onChange={(e) => onChange(e.target.value)} />;
  }
}
