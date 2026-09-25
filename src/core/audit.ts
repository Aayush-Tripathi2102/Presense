import { db } from "@/lib/db";

export async function audit(action: string, opts: { userId?: string; entity?: string; entityId?: string; metadata?: unknown } = {}) {
  try {
    await db.auditLog.create({
      data: {
        action, userId: opts.userId, entity: opts.entity, entityId: opts.entityId,
        metadata: JSON.stringify(opts.metadata ?? {}),
      },
    });
  } catch (e) { console.error("audit failed", e); }
}

export async function notify(userId: string, title: string, body?: string) {
  return db.notification.create({ data: { userId, title, body } });
}
