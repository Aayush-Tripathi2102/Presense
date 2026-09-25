export function slugify(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "org";
}
export function uid(len = 12): string {
  return Math.random().toString(36).slice(2, 2 + len);
}
