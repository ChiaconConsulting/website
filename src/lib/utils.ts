export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export function formatDate(d: Date | string | null | undefined) {
  if (!d) return "";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }).format(new Date(d));
}

export function readMinutes(text: string) {
  return Math.max(1, Math.round(text.trim().split(/\s+/).length / 220));
}

export function csvCell(value: unknown) {
  let s = value == null ? "" : String(value);
  // Neutralise spreadsheet formula injection from user-submitted text.
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return `"${s.replace(/"/g, '""')}"`;
}
