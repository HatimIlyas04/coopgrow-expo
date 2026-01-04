// backend/src/utils/url.js

export function fullImageUrl(req, path) {
  if (!path) return null;

  // already full URL
  if (path.startsWith("http")) return path;

  // remove any leading slash
  const clean = path.startsWith("/") ? path.slice(1) : path;

  // detect host automatically from request
  const base = `${req.protocol}://${req.get("host")}`;

  return `${base}/${clean}`;
}
