function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";

  // Expected format: Authorization: Bearer <token>
  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "missing or invalid Authorization header" });
  }

  const expected = process.env.AUTH_TOKEN;
  if (!expected) {
    // If you forgot to set AUTH_TOKEN, treat as unauthorized.
    return res.status(500).json({ error: "AUTH_TOKEN not configured" });
  }

  if (token !== expected) {
    return res.status(401).json({ error: "unauthorized" });
  }

  next();
}

module.exports = authMiddleware;

