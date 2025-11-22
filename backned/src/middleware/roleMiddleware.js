// Role-based authorization helpers
function _unauthorized(res) {
  return res.status(401).json({ error: "Unauthorized" });
}

function _forbidden(res) {
  return res.status(403).json({ error: "Forbidden" });
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const user = req.user;
    if (!user) return _unauthorized(res);
    if (!allowedRoles.includes(user.role)) return _forbidden(res);
    next();
  };
}

// Alias for semantic clarity
function requireAnyRole(...roles) {
  return requireRole(...roles);
}

module.exports = requireRole;
module.exports.requireAnyRole = requireAnyRole;
module.exports._forbidden = _forbidden;
