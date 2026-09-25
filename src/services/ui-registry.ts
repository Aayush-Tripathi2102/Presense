import type { ComponentType } from "react";
import { SeoWorkspace } from "./seo/ui/SeoWorkspace";

/**
 * Service UI registration — the extension point for live service workspaces.
 * Server-safe module: it only maps slugs to (client) components.
 * Adding a new service UI = adding one entry here + the module component.
 * No changes to auth, navigation shell, or the generic service page.
 */
const SERVICE_UI: Record<string, ComponentType> = {
  seo: SeoWorkspace,
};

export function serviceUiFor(slug: string): ComponentType | null {
  return SERVICE_UI[slug] ?? null;
}
