import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";

export function Button({ className, variant = "primary", ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  const styles: Record<ButtonVariant, string> = {
    primary: "bg-zinc-950 text-white hover:bg-zinc-800",
    secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
    ghost: "text-zinc-600 hover:bg-zinc-100",
    outline: "border border-zinc-300 bg-white hover:bg-zinc-50"
  };
  return <button className={cn("inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50", styles[variant], className)} {...rest} />;
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-xl border border-zinc-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]", className)}>{children}</div>;
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900", props.className)} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn("w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900", props.className)} />;
}

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn("w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900", className)}>{children}</select>;
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-zinc-500">{hint}</span>}
    </label>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const color = status === "connected" ? "bg-emerald-100 text-emerald-800"
    : status === "coming_soon" ? "bg-amber-100 text-amber-800"
    : status === "error" ? "bg-red-100 text-red-800"
    : "bg-zinc-100 text-zinc-600";
  return <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold", color)}>{status.replaceAll("_", " ")}</span>;
}

export function MockBadge() {
  return <span className="mock-badge inline-flex rounded bg-violet-100 px-2 py-0.5 font-bold text-violet-700">Mock data</span>;
}

export function EmptyState({ title, body, action }: { title: string; body: string[]; action?: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center">
      <p className="text-base font-semibold">{title}</p>
      <ul className="mx-auto mt-3 max-w-md space-y-1 text-sm text-zinc-600">
        {body.map((b) => <li key={b}>• {b}</li>)}
      </ul>
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

export function MetricCard({ label, value, sub, mock }: { label: string; value: string; sub?: string; mock?: boolean }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</p>
        {mock && <MockBadge />}
      </div>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      {sub && <p className="mt-1 text-xs text-zinc-500">{sub}</p>}
    </Card>
  );
}

export function IntegrationCard({ name, status, onConnect, comingSoon }: { name: string; status: string; onConnect?: () => void; comingSoon?: boolean }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <p className="font-semibold">{name}</p>
        <StatusBadge status={status} />
      </div>
      <div className="mt-4">
        {comingSoon ? (
          <Button variant="secondary" disabled>Coming soon</Button>
        ) : status === "connected" ? (
          <Button variant="secondary" disabled>Connected</Button>
        ) : (
          <Button variant="outline" onClick={onConnect}>Connect</Button>
        )}
      </div>
      {!comingSoon && status !== "connected" && (
        <p className="mt-2 text-xs text-zinc-500">Real OAuth only — never shown as connected until the flow succeeds.</p>
      )}
    </Card>
  );
}

export function AIInsight({ title, body }: { title: string; body: string }) {
  return (
    <Card className="border-violet-200 bg-violet-50/50">
      <div className="flex items-center gap-2">
        <p className="font-semibold">{title}</p><MockBadge />
      </div>
      <p className="mt-1 text-sm text-zinc-700">{body}</p>
    </Card>
  );
}

export function ActionCard({ title, body, cta }: { title: string; body: string; cta?: ReactNode }) {
  return (
    <Card>
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm text-zinc-600">{body}</p>
      {cta && <div className="mt-3">{cta}</div>}
    </Card>
  );
}

export function ProgressIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-200">
        <div className="h-full rounded-full bg-zinc-950 transition-all" style={{ width: `${(current / total) * 100}%` }} />
      </div>
      <span className="text-xs font-semibold text-zinc-600">{current}/{total}</span>
    </div>
  );
}
