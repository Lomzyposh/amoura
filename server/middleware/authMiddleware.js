const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const header = req.header("Authorization");

  if (!header) {
    return res.status(401).json({ message: "Not authorized" });
  }

  // Expecting "Bearer <token>" or just "<token>"
  const token = header.startsWith("Bearer ")
    ? header.slice(7)
    : header;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id; // we signed { id: user._id }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid" });
  }
};