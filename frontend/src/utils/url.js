export function fullImageUrl(req, path) {
  if (!path) return null;

  // if already full url
  if (path.startsWith("http")) return path;

  const base =
    process.env.APP_URL ||
    `${req.protocol}://${req.get("host")}`;

  return `${base}/${path}`;
}
