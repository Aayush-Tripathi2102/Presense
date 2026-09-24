// Zero-config runtime store for Phase 1.
// Mirrors the Drizzle/Postgres schema in a JSON file so `npm run dev` works
// with no external DB. When DATABASE_URL is set, swap this module's backend
// for Drizzle + Postgres without changing callers (same record shapes).

import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

const DATA_FILE = path.join(process.cwd(), ".data", "db.json");

type Collection = Record<string, any[]>;

const EMPTY: Collection = {
  users: [],
  organizations: [],
  organization_members: [],
  onboarding_progress: [],
  websites: [],
  jobs: [],
  integrations: [],
  social_accounts: [],
  content_items: [],
  audit_logs: []
};

async function readAll(): Promise<Collection> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    return { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    return structuredClone(EMPTY);
  }
}

async function writeAll(data: Collection) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

function now() {
  return new Date().toISOString();
}

export const store = {
  async list(collection: string, where?: (r: any) => boolean): Promise<any[]> {
    const data = await readAll();
    const rows = data[collection] ?? [];
    return where ? rows.filter(where) : rows;
  },
  async find(collection: string, where: (r: any) => boolean): Promise<any | null> {
    const rows = await this.list(collection, where);
    return rows[0] ?? null;
  },
  async insert(collection: string, record: Record<string, any>): Promise<any> {
    const data = await readAll();
    const row = {
      id: record.id ?? randomUUID(),
      createdAt: now(),
      updatedAt: now(),
      ...record
    };
    data[collection] = [...(data[collection] ?? []), row];
    await writeAll(data);
    return row;
  },
  async update(collection: string, id: string, patch: Record<string, any>): Promise<any | null> {
    const data = await readAll();
    const rows = data[collection] ?? [];
    const idx = rows.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    rows[idx] = { ...rows[idx], ...patch, updatedAt: now() };
    await writeAll(data);
    return rows[idx];
  },
  async upsert(collection: string, where: (r: any) => boolean, record: Record<string, any>): Promise<any> {
    const existing = await this.find(collection, where);
    if (existing) return this.update(collection, existing.id, record);
    return this.insert(collection, record);
  }
};

export function isPostgresConfigured() {
  return Boolean(process.env.DATABASE_URL);
}
