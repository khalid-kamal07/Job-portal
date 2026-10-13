const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
exports.dashboard = async (req, res, next) => {
  try {
    const [
      users,
      candidates,
      employers,
      jobs,
      activeJobs,
      applications,
      latestJobs,
      latestApplications,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "candidate" }),
      User.countDocuments({ role: "employer" }),
      Job.countDocuments(),
      Job.countDocuments({ status: "active" }),
      Application.countDocuments(),
      Job.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("createdBy", "name company"),
      Application.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("candidate", "name")
        .populate("job", "title company"),
    ]);
    res.json({
      stats: { users, candidates, employers, jobs, activeJobs, applications },
      latestJobs,
      latestApplications,
    });
  } catch (e) {
    next(e);
  }
};
exports.users = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).limit(1000);
    res.json({ users });
  } catch (e) {
    next(e);
  }
};
exports.updateUserRole = async (req, res, next) => {
  try {
    if (String(req.user._id) === req.params.id)
      return res
        .status(400)
        .json({ message: "You cannot change your own role." });
    if (!["candidate", "employer", "admin"].includes(req.body.role))
      return res.status(400).json({ message: "Invalid role." });
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true },
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ user });
  } catch (e) {
    next(e);
  }
};
exports.deleteUser = async (req, res, next) => {
  try {
    if (String(req.user._id) === req.params.id)
      return res
        .status(400)
        .json({ message: "You cannot delete your own account." });
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    const jobs = await Job.find({ createdBy: user._id }).select("_id");
    await Application.deleteMany({
      $or: [{ candidate: user._id }, { job: { $in: jobs.map((j) => j._id) } }],
    });
    await Job.deleteMany({ createdBy: user._id });
    await user.deleteOne();
    res.json({ message: "User and related data deleted." });
  } catch (e) {
    next(e);
  }
};
