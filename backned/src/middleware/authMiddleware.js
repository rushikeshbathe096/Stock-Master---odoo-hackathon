const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.replace("Bearer ", "");

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // normalize user payload so downstream code can rely on fields
    req.user = {
      userId: decoded.userId || decoded.id || null,
      role: decoded.role || "warehouse_staff",
      name: decoded.name || null,
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

module.exports = authMiddleware;
