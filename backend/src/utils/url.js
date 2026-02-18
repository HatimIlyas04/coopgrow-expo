export function fullImageUrl(req, value) {
  if (!value) return null;

  // already a full URL (Cloudinary, S3, etc.)
  if (typeof value === "string" && /^https?:\/\//i.test(value)) return value;

  // normalize: ensure it starts with "/"
  const path = value.startsWith("/") ? value : `/${value}`;

  return `${req.protocol}://${req.get("host")}${path}`;
}
