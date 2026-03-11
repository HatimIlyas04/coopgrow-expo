const API_BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "")
  : "";

export const imageUrl = (path) => {
  if (!path) return null;

  if (
    typeof path === "string" &&
    (path.startsWith("http://") || path.startsWith("https://"))
  ) {
    return path;
  }

  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${clean}`;
};