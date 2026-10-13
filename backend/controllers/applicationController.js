const Application = require("../models/Application");
const Job = require("../models/Job");
exports.apply = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job || job.status !== "active")
      return res
        .status(404)
        .json({ message: "This job is no longer accepting applications." });
    if (String(job.createdBy) === String(req.user._id))
      return res
        .status(400)
        .json({ message: "You cannot apply to your own job post." });
    const existing = await Application.findOne({
      job: job._id,
      candidate: req.user._id,
    });
    if (existing)
      return res
        .status(409)
        .json({ message: "You have already applied to this job." });
    const application = await Application.create({
      job: job._id,
      candidate: req.user._id,
      coverLetter: req.body.coverLetter || "",
      resumeUrl: req.body.resumeUrl || req.user.resumeUrl || "",
    });
    await Job.updateOne({ _id: job._id }, { $inc: { applicationsCount: 1 } });
    res
      .status(201)
      .json({ application, message: "Application submitted successfully." });
  } catch (e) {
    next(e);
  }
};
exports.myApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate("job")
      .sort({ createdAt: -1 });
    res.json({ applications });
  } catch (e) {
    next(e);
  }
};
exports.jobApplications = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found." });
    if (
      String(job.createdBy) !== String(req.user._id) &&
      req.user.role !== "admin"
    )
      return res
        .status(403)
        .json({ message: "You cannot view these applications." });
    const applications = await Application.find({ job: job._id })
      .populate("candidate", "name email headline location skills resumeUrl")
      .populate("job", "title company")
      .sort({ createdAt: -1 });
    res.json({ applications });
  } catch (e) {
    next(e);
  }
};
exports.updateApplication = async (req, res, next) => {
  try {
    const app = await Application.findById(req.params.id).populate("job");
    if (!app)
      return res.status(404).json({ message: "Application not found." });
    if (
      String(app.job.createdBy) !== String(req.user._id) &&
      req.user.role !== "admin"
    )
      return res
        .status(403)
        .json({ message: "You cannot update this application." });
    const allowed = [
      "Submitted",
      "Reviewing",
      "Shortlisted",
      "Rejected",
      "Hired",
    ];
    if (!allowed.includes(req.body.status))
      return res.status(400).json({ message: "Invalid application status." });
    app.status = req.body.status;
    if (req.body.employerNote !== undefined)
      app.employerNote = req.body.employerNote;
    await app.save();
    res.json({ application: app });
  } catch (e) {
    next(e);
  }
};
exports.allApplications = async (req, res, next) => {
  try {
    const applications = await Application.find()
      .populate("candidate", "name email")
      .populate("job", "title company")
      .sort({ createdAt: -1 })
      .limit(500);
    res.json({ applications });
  } catch (e) {
    next(e);
  }
};
