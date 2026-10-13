const jwt = require("jsonwebtoken");
const User = require("../models/User");
async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token)
      return res.status(401).json({ message: "Please sign in to continue." });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user)
      return res.status(401).json({ message: "Account no longer exists." });
    next();
  } catch (error) {
    return res
      .status(401)
      .json({
        message: "Your session is invalid or expired. Please sign in again.",
      });
  }
}
function allowRoles(...roles) {
  return (req, res, next) =>
    roles.includes(req.user.role)
      ? next()
      : res
          .status(403)
          .json({
            message: "You do not have permission to perform this action.",
          });
}
module.exports = { protect, allowRoles };
