export function imageUrl(value) {
  if (!value) return "";

  // إذا URL كامل (Cloudinary) خليه
  if (/^https?:\/\//i.test(value)) return value;

  // إذا path محلي (/uploads/...) ركّبو مع host ديال backend (نحيدو /api)
  const api = (import.meta.env.VITE_API_URL || "").trim();
  const base = api.replace(/\/api\/?$/i, "");

  const path = value.startsWith("/") ? value : `/${value}`;
  return `${base}${path}`;
}
