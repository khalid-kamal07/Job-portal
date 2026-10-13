const mongoose = require("mongoose");
const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    company: { type: String, required: true, trim: true, maxlength: 100 },
    companyLogo: { type: String, default: "" },
    location: { type: String, required: true, trim: true },
    workplace: {
      type: String,
      enum: ["Remote", "Hybrid", "On-site"],
      default: "On-site",
    },
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship", "Freelance"],
      default: "Full-time",
    },
    category: { type: String, required: true, trim: true },
    experience: {
      type: String,
      enum: ["Entry level", "1–3 years", "3–5 years", "5+ years"],
      default: "Entry level",
    },
    salaryMin: { type: Number, min: 0, default: 0 },
    salaryMax: { type: Number, min: 0, default: 0 },
    currency: { type: String, default: "PKR" },
    description: { type: String, required: true, minlength: 30 },
    requirements: [{ type: String, trim: true }],
    skills: [{ type: String, trim: true }],
    status: { type: String, enum: ["active", "closed"], default: "active" },
    featured: { type: Boolean, default: false },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applicationsCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);
jobSchema.index({
  title: "text",
  company: "text",
  description: "text",
  skills: "text",
  category: "text",
});
jobSchema.index({ status: 1, createdAt: -1 });
module.exports = mongoose.model("Job", jobSchema);
