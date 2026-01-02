import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const hasBearer = authHeader.startsWith("Bearer ");
  if (!hasBearer) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.slice("Bearer ".length).trim();
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};
