export function imageUrl(value) {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;

  const api = (import.meta.env.VITE_API_URL || "").trim();
  const base = api.replace(/\/api\/?$/i, "");

  const path = value.startsWith("/") ? value : `/${value}`;
  return `${base}${path}`;
}
