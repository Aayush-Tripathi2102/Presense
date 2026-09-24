import { Card, EmptyState, MockBadge } from "@/components/ui";

export function ModuleShell({ title, desc, cards, emptyTitle, body }: {
  title: string; desc: string; cards?: [string, string][]; emptyTitle: string; body: string[];
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">{title} <MockBadge /></h1>
        <p className="mt-1 text-sm text-zinc-600">{desc}</p>
      </div>
      {cards && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(([t, d]) => (
            <Card key={t}><p className="font-semibold">{t}</p><p className="mt-1 text-sm text-zinc-600">{d}</p></Card>
          ))}
        </div>
      )}
      <EmptyState title={emptyTitle} body={body} />
    </div>
  );
}
