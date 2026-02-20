// frontend/src/utils/imageUrl.js

const API_BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "")
  : "http://localhost:5000";

// كيرجع URL صحيحة فـ 3 حالات:
// 1) null -> null
// 2) https://... -> نفسو
// 3) /uploads/... -> API_BASE + /uploads/...
export const imageUrl = (path) => {
  if (!path) return null;

  // already full url
  if (typeof path === "string" && (path.startsWith("http://") || path.startsWith("https://"))) {
    return path;
  }

  // ensure starts with /
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${clean}`;
};
