export function getUploadedUrl(req) {
  const f = req.file;
  if (!f) return null;

  return (
    f.secure_url ||
    f.path || 
    f.url ||
    (f.filename ? `/uploads/${f.filename}` : null) // fallback local
  );
}
