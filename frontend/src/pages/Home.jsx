import { Link } from "react-router-dom";
import {
  ArrowRight,
  Search,
  MapPin,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Users,
  Briefcase,
  Clock3,
  Globe2,
  HeartHandshake,
} from "lucide-react";
import { useEffect, useState } from "react";
import api, { errorMessage } from "../utils/api";
import { Empty } from "../components/Layout";
const categories = [
  ["Code & technology", "Technology"],
  ["Design & creative", "Design"],
  ["Marketing & growth", "Marketing"],
  ["Business & finance", "Business"],
  ["Customer success", "Customer Support"],
  ["Operations", "Operations"],
];
export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [term, setTerm] = useState("");
  const [place, setPlace] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    api
      .get("/jobs?limit=6")
      .then((r) => setJobs(r.data.jobs))
      .catch((e) => setError(errorMessage(e)));
  }, []);
  const go = (e) => {
    e.preventDefault();
    const q = new URLSearchParams();
    if (term) q.set("search", term);
    if (place) q.set("location", place);
    window.location.href = `/jobs?${q.toString()}`;
  };
  return (
    <>
      <section className="hero">
        <div className="hero-orb orb-one" />
        <div className="hero-orb orb-two" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">
              <Sparkles size={15} /> YOUR NEXT CHAPTER STARTS HERE
            </div>
            <h1>
              Find work that
              <br /> <span>moves you forward.</span>
            </h1>
            <p className="hero-lede">
              Real opportunities. Great teams. Work that fits your life. Your
              next career move is closer than you think.
            </p>
            <form className="search-panel" onSubmit={go}>
              <label className="search-field">
                <Search size={19} />
                <input
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="Job title, skill, or company"
                  aria-label="Search jobs"
                />
              </label>
              <span className="search-divider" />
              <label className="search-field">
                <MapPin size={19} />
                <input
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  placeholder="City or remote"
                  aria-label="Location"
                />
              </label>
              <button className="btn btn-primary search-submit">
                Search jobs <ArrowRight size={17} />
              </button>
            </form>
            <div className="hero-trust">
              <div className="avatar-stack">
                <span>J</span>
                <span>A</span>
                <span>M</span>
                <span>+</span>
              </div>
              <p>
                <strong>New opportunities every week</strong>
                <br />
                Built for people ready for more.
              </p>
            </div>
          </div>
          <div className="hero-art">
            <div className="art-glow" />
            <div className="art-card art-main">
              <div className="art-card-top">
                <span className="company-mark mark-purple">N</span>
                <span className="tag tag-green">Actively hiring</span>
              </div>
              <p className="art-kicker">FEATURED OPPORTUNITY</p>
              <h3>Product Designer</h3>
              <p className="muted">Northstar Studio · Remote</p>
              <div className="art-tags">
                <span>Full-time</span>
                <span>Design</span>
              </div>
              <div className="art-bottom">
                <strong>$85k – $110k</strong>
                <span className="round-arrow">
                  <ArrowRight size={18} />
                </span>
              </div>
            </div>
            <div className="floating-note note-top">
              <span className="note-icon green">
                <ShieldCheck size={18} />
              </span>
              <span>
                <strong>Better matches</strong>
                <small>Opportunities for you</small>
              </span>
            </div>
            <div className="floating-note note-bottom">
              <span className="note-icon yellow">
                <TrendingUp size={18} />
              </span>
              <span>
                <strong>Career growth</strong>
                <small>Your next step matters</small>
              </span>
            </div>
            <div className="art-dots" />
          </div>
        </div>
      </section>
      <section className="stats-strip">
        <div className="container stats-grid">
          <div>
            <span className="stat-icon">
              <Briefcase size={19} />
            </span>
            <p>
              <strong>Fresh opportunities</strong>
              <small>Roles updated regularly</small>
            </p>
          </div>
          <div>
            <span className="stat-icon">
              <Users size={19} />
            </span>
            <p>
              <strong>People-first hiring</strong>
              <small>Connect with real teams</small>
            </p>
          </div>
          <div>
            <span className="stat-icon">
              <Globe2 size={19} />
            </span>
            <p>
              <strong>Work your way</strong>
              <small>Remote, hybrid, or onsite</small>
            </p>
          </div>
          <div>
            <span className="stat-icon">
              <HeartHandshake size={19} />
            </span>
            <p>
              <strong>One simple platform</strong>
              <small>From search to application</small>
            </p>
          </div>
        </div>
      </section>
      <section className="section container">
        <div className="section-heading">
          <div>
            <div className="eyebrow">EXPLORE OPPORTUNITIES</div>
            <h2>Find your kind of work.</h2>
            <p>Browse roles across the fields shaping tomorrow.</p>
          </div>
          <Link to="/jobs" className="text-link">
            Explore all jobs <ArrowRight size={17} />
          </Link>
        </div>
        <div className="category-grid">
          {categories.map(([title, cat], i) => (
            <Link
              className="category-card"
              to={`/jobs?category=${encodeURIComponent(cat)}`}
              key={title}
            >
              <span className={`category-symbol symbol-${i}`}>
                {["⌘", "✳", "↗", "◈", "☏", "◷"][i]}
              </span>
              <h3>{title}</h3>
              <p>
                Discover opportunities <ArrowRight size={14} />
              </p>
            </Link>
          ))}
        </div>
      </section>
      <section className="section section-tint">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">HAND-PICKED FOR YOU</div>
              <h2>Opportunities worth a look.</h2>
              <p>Discover the latest roles from teams looking for talent.</p>
            </div>
            <Link to="/jobs" className="text-link">
              View all jobs <ArrowRight size={17} />
            </Link>
          </div>
          {error && <p className="inline-error">{error}</p>}
          <div className="job-grid">
            {jobs.map((job) => (
              <JobPreview key={job._id} job={job} />
            ))}
            {!jobs.length && !error && (
              <Empty
                title="New roles are on the way"
                text="Check back soon or explore all available jobs."
              />
            )}
          </div>
        </div>
      </section>
      <section className="cta-section container">
        <div className="cta-card">
          <div className="cta-icon">
            <Briefcase size={24} />
          </div>
          <div>
            <h2>Building a team?</h2>
            <p>
              Meet people who bring fresh ideas, real skills, and ambition to
              your business.
            </p>
          </div>
          <Link to="/register?role=employer" className="btn btn-light">
            Hire great people <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}
function JobPreview({ job }) {
  return (
    <Link to={`/jobs/${job._id}`} className="job-card">
      <div className="job-card-top">
        <div className="company-mark">
          {(job.company || "C").charAt(0).toUpperCase()}
        </div>
        <span className="job-type">{job.workplace}</span>
      </div>
      <h3>{job.title}</h3>
      <p className="company-name">
        {job.company} <span>·</span> {job.location}
      </p>
      <div className="job-tags">
        <span>{job.type}</span>
        <span>{job.category}</span>
      </div>
      <div className="job-card-bottom">
        <strong>
          {job.salaryMax
            ? `${job.currency} ${Number(job.salaryMin || 0).toLocaleString()} – ${Number(job.salaryMax).toLocaleString()}`
            : "Salary not specified"}
        </strong>
        <span>
          <Clock3 size={14} />{" "}
          {new Date(job.createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    </Link>
  );
}
