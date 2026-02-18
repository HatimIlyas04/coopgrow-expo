export function imageUrl(value) {
  if (!value) return "";

  if (/^https?:\/\//i.test(value)) return value;

  const base = (import.meta.env.VITE_API_URL || "").replace(/\/api\/?$/i, "");
  const path = value.startsWith("/") ? value : `/${value}`;

  return `${base}${path}`;
}
