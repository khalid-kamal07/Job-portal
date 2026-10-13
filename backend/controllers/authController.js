const jwt = require("jsonwebtoken");
const User = require("../models/User");
const tokenFor = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
const safeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  headline: user.headline,
  location: user.location,
  skills: user.skills,
  resumeUrl: user.resumeUrl,
  company: user.company,
});
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, company } = req.body;
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ message: "Name, email and password are required." });
    if (password.length < 8)
      return res
        .status(400)
        .json({ message: "Password must contain at least 8 characters." });
    if (role && !["candidate", "employer"].includes(role))
      return res.status(400).json({ message: "Invalid account role." });
    if (role === "employer" && !String(company || "").trim())
      return res
        .status(400)
        .json({ message: "Company name is required for employer accounts." });
    if (await User.findOne({ email: email.toLowerCase().trim() }))
      return res
        .status(409)
        .json({ message: "An account with this email already exists." });
    const user = await User.create({
      name,
      email,
      password,
      role: role || "candidate",
      company: company || "",
    });
    res.status(201).json({ token: tokenFor(user), user: safeUser(user) });
  } catch (e) {
    next(e);
  }
};
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email: String(email || "")
        .toLowerCase()
        .trim(),
    }).select("+password");
    if (!user || !(await user.comparePassword(password || "")))
      return res
        .status(401)
        .json({ message: "Email or password is incorrect." });
    res.json({ token: tokenFor(user), user: safeUser(user) });
  } catch (e) {
    next(e);
  }
};
exports.me = async (req, res) => res.json({ user: safeUser(req.user) });
exports.updateProfile = async (req, res, next) => {
  try {
    const allowed = [
      "name",
      "headline",
      "location",
      "skills",
      "resumeUrl",
      "company",
    ];
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) req.user[key] = req.body[key];
    });
    await req.user.save();
    res.json({ user: safeUser(req.user) });
  } catch (e) {
    next(e);
  }
};
