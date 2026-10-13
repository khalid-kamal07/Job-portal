require("dotenv").config();
const connectDB = require("../config/db");
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const User = require("../models/User");
const Job = require("../models/Job");
const sampleJobs = [
  {
    title: "MERN Stack Developer",
    company: "PixelCraft Studio",
    location: "Karachi, Pakistan",
    workplace: "Hybrid",
    type: "Full-time",
    category: "Technology",
    experience: "1–3 years",
    salaryMin: 90000,
    salaryMax: 160000,
    currency: "PKR",
    description:
      "We are looking for a curious MERN Stack Developer to build and improve responsive web products. You will work with designers and engineers to ship reliable features, write maintainable code, and improve application performance.",
    requirements: [
      "Hands-on experience with React and Node.js",
      "Comfort with REST APIs and MongoDB",
      "Familiarity with Git and collaborative workflows",
    ],
    skills: ["React", "Node.js", "Express", "MongoDB", "REST APIs"],
  },
  {
    title: "Frontend React Developer",
    company: "Northstar Digital",
    location: "Remote",
    workplace: "Remote",
    type: "Full-time",
    category: "Technology",
    experience: "Entry level",
    salaryMin: 70000,
    salaryMax: 120000,
    currency: "PKR",
    description:
      "Join a product team focused on thoughtful user experiences. You will turn designs into accessible, fast React interfaces, collaborate on reusable components, and help maintain a high-quality frontend codebase.",
    requirements: [
      "Good understanding of JavaScript and React",
      "Responsive CSS and component design",
      "Strong communication and willingness to learn",
    ],
    skills: ["React", "JavaScript", "CSS", "HTML", "Vite"],
  },
  {
    title: "Product UI/UX Designer",
    company: "Brightside Labs",
    location: "Lahore, Pakistan",
    workplace: "Hybrid",
    type: "Full-time",
    category: "Design",
    experience: "1–3 years",
    salaryMin: 80000,
    salaryMax: 140000,
    currency: "PKR",
    description:
      "Help us make complex products feel simple. You will own design explorations, build prototypes, collaborate with product managers and engineers, and bring user feedback into every iteration.",
    requirements: [
      "A portfolio of product design work",
      "Experience with user flows and prototyping",
      "Ability to explain design decisions",
    ],
    skills: ["Figma", "Prototyping", "Design systems", "User research"],
  },
  {
    title: "Digital Marketing Associate",
    company: "Good Growth Co.",
    location: "Islamabad, Pakistan",
    workplace: "On-site",
    type: "Full-time",
    category: "Marketing",
    experience: "Entry level",
    salaryMin: 55000,
    salaryMax: 85000,
    currency: "PKR",
    description:
      "Support campaigns across content, email, and social channels. This is a hands-on role for someone who enjoys learning from data, communicating clearly, and helping a growing team connect with customers.",
    requirements: [
      "Clear writing and attention to detail",
      "Comfort using spreadsheets and analytics",
      "Organized approach to project work",
    ],
    skills: ["Content", "Social media", "Analytics", "Email marketing"],
  },
  {
    title: "Customer Success Specialist",
    company: "Orbit SaaS",
    location: "Remote",
    workplace: "Remote",
    type: "Full-time",
    category: "Customer Support",
    experience: "1–3 years",
    salaryMin: 65000,
    salaryMax: 100000,
    currency: "PKR",
    description:
      "Help customers get the most out of a growing software platform. You will guide onboarding, answer product questions, share customer feedback with the team, and identify ways to improve the customer experience.",
    requirements: [
      "Strong written and verbal communication",
      "Patient, structured problem-solving",
      "Experience supporting customers is a plus",
    ],
    skills: ["Communication", "Customer support", "Problem solving", "SaaS"],
  },
  {
    title: "Backend Developer Intern",
    company: "Stackwise Technologies",
    location: "Karachi, Pakistan",
    workplace: "On-site",
    type: "Internship",
    category: "Technology",
    experience: "Entry level",
    salaryMin: 25000,
    salaryMax: 40000,
    currency: "PKR",
    description:
      "Learn alongside experienced engineers while contributing to APIs, database models, and internal tools. You will get practical code review feedback and work on scoped tasks that ship to real users.",
    requirements: [
      "JavaScript fundamentals",
      "Basic understanding of HTTP and APIs",
      "Curiosity about databases and backend systems",
    ],
    skills: ["Node.js", "Express", "MongoDB", "Git"],
  },
];
(async () => {
  try {
    await connectDB();
    let admin = await User.findOne({
      email: String(
        process.env.ADMIN_EMAIL || "admin@talentbridge.local",
      ).toLowerCase(),
    });
    if (!admin) {
      admin = await User.create({
        name: process.env.ADMIN_NAME || "TalentBridge Admin",
        email: process.env.ADMIN_EMAIL || "admin@talentbridge.local",
        password: process.env.ADMIN_PASSWORD || "ChangeThisPassword123!",
        role: "admin",
        company: "TalentBridge",
      });
      console.log(
        "Created admin account. Change the seed password immediately.",
      );
    } else if (admin.role !== "admin") {
      admin.role = "admin";
      await admin.save();
    }
    let employer = await User.findOne({ email: "hiring@pixelcraft.example" });
    if (!employer) {
      employer = await User.create({
        name: "PixelCraft Hiring Team",
        email: "hiring@pixelcraft.example",
        password: "ExampleHiring123!",
        role: "employer",
        company: "PixelCraft Studio",
      });
    }
    const count = await Job.countDocuments();
    if (count === 0) {
      await Job.insertMany(
        sampleJobs.map((j, i) => ({
          ...j,
          createdBy: employer._id,
          featured: i < 2,
        })),
      );
      console.log("Inserted sample job listings.");
    }
    console.log("Seed complete. Admin email:", admin.email);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
