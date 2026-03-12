export const imageUrl = (path) => {
  if (!path) return null;

  if (path.startsWith("http")) {
    return path;
  }

  return `https://coopgrow-expo.onrender.com${path}`;
};