module.exports = function selfOrAdmin(req, res, next) {
  if (req.user.role === "admin") return next();
  if (req.user.id === req.params.id) return next();

  return res.status(403).json({ error: "Access denied" });
};
