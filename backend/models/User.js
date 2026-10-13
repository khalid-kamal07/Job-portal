const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 8, select: false },
    role: {
      type: String,
      enum: ["candidate", "employer", "admin"],
      default: "candidate",
    },
    headline: { type: String, trim: true, maxlength: 140, default: "" },
    location: { type: String, trim: true, maxlength: 100, default: "" },
    skills: [{ type: String, trim: true }],
    resumeUrl: { type: String, default: "" },
    company: { type: String, trim: true, maxlength: 100, default: "" },
  },
  { timestamps: true },
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};
module.exports = mongoose.model("User", userSchema);
