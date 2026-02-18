export function fullImageUrl(req, imagePath) {
  if (!imagePath) return null;

  return `${req.protocol}://${req.get("host")}/${imagePath}`;
}
