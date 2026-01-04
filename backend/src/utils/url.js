export function fullImageUrl(req, path) {
  if (!path) return null;

  // if already full URL
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const base = `${req.protocol}://${req.get("host")}`;
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}
