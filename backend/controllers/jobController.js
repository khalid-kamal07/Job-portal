const Job = require("../models/Job");
const Application = require("../models/Application");
exports.listJobs = async (req, res, next) => {
  try {
    const {
      search = "",
      location = "",
      type = "",
      workplace = "",
      category = "",
      experience = "",
      sort = "newest",
      page = 1,
      limit = 12,
    } = req.query;
    const query = { status: "active" };
    if (search.trim())
      query.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { company: { $regex: search.trim(), $options: "i" } },
        { skills: { $in: [new RegExp(search.trim(), "i")] } },
        { category: { $regex: search.trim(), $options: "i" } },
      ];
    if (location.trim())
      query.location = { $regex: location.trim(), $options: "i" };
    if (type) query.type = type;
    if (workplace) query.workplace = workplace;
    if (category) query.category = category;
    if (experience) query.experience = experience;
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(30, Math.max(1, Number(limit) || 12));
    const sortBy =
      sort === "salary"
        ? { salaryMax: -1, createdAt: -1 }
        : sort === "oldest"
          ? { createdAt: 1 }
          : { featured: -1, createdAt: -1 };
    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate("createdBy", "name company")
        .sort(sortBy)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Job.countDocuments(query),
    ]);
    res.json({
      jobs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (e) {
    next(e);
  }
};
exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "createdBy",
      "name company email",
    );
    if (!job) return res.status(404).json({ message: "Job not found." });
    if (
      job.status === "closed" &&
      (!req.user ||
        (String(req.user._id) !== String(job.createdBy._id) &&
          req.user.role !== "admin"))
    )
      return res.status(404).json({ message: "Job not found." });
    res.json({ job });
  } catch (e) {
    next(e);
  }
};
exports.createJob = async (req, res, next) => {
  try {
    const body = {
      ...req.body,
      createdBy: req.user._id,
      company: req.body.company || req.user.company || "",
    };
    if (
      !body.title ||
      !body.company ||
      !body.location ||
      !body.category ||
      !body.description
    )
      return res
        .status(400)
        .json({ message: "Please complete all required job fields." });
    const job = await Job.create(body);
    res.status(201).json({ job });
  } catch (e) {
    next(e);
  }
};
exports.updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found." });
    if (
      String(job.createdBy) !== String(req.user._id) &&
      req.user.role !== "admin"
    )
      return res
        .status(403)
        .json({ message: "You can only edit jobs posted by your account." });
    const fields = [
      "title",
      "company",
      "companyLogo",
      "location",
      "workplace",
      "type",
      "category",
      "experience",
      "salaryMin",
      "salaryMax",
      "currency",
      "description",
      "requirements",
      "skills",
      "status",
      "featured",
    ];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) job[f] = req.body[f];
    });
    await job.save();
    res.json({ job });
  } catch (e) {
    next(e);
  }
};
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found." });
    if (
      String(job.createdBy) !== String(req.user._id) &&
      req.user.role !== "admin"
    )
      return res
        .status(403)
        .json({ message: "You can only delete jobs posted by your account." });
    await Application.deleteMany({ job: job._id });
    await job.deleteOne();
    res.json({ message: "Job and related applications deleted." });
  } catch (e) {
    next(e);
  }
};
exports.myJobs = async (req, res, next) => {
  try {
    const filter = req.user.role === "admin" ? {} : { createdBy: req.user._id };
    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json({ jobs });
  } catch (e) {
    next(e);
  }
};
