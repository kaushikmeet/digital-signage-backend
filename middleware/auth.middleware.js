const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token = null;

   if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token && req.query.token) {
    token = req.query.token;
  }

   if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access only" });
  }
  next();
};
