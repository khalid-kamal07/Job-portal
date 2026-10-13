import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  MapPin,
  Building2,
  Clock3,
  BriefcaseBusiness,
  CheckCircle2,
  Bookmark,
  Share2,
  CalendarDays,
  Wallet,
  ArrowRight,
} from "lucide-react";
import api, { errorMessage } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { Loading, Alert } from "../components/Layout";
export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cover, setCover] = useState("");
  const [resume, setResume] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    api
      .get(`/jobs/${id}`)
      .then((r) => setJob(r.data.job))
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false));
  }, [id]);
  const apply = async () => {
    if (!user) return nav("/login");
    if (user.role !== "candidate")
      return setMessage("Only candidate accounts can apply to jobs.");
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await api.post(`/applications/job/${id}`, {
        coverLetter: cover,
        resumeUrl: resume || user.resumeUrl,
      });
      setMessage("Your application has been submitted. Good luck!");
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };
  if (loading)
    return (
      <div className="container detail-loading">
        <Loading />
      </div>
    );
  if (error && !job)
    return (
      <div className="container detail-loading">
        <Alert>{error}</Alert>
        <Link to="/jobs" className="text-link">
          Back to jobs
        </Link>
      </div>
    );
  if (!job) return null;
  return (
    <div className="container detail-page">
      <Link to="/jobs" className="back-link">
        <ArrowLeft size={16} /> Back to opportunities
      </Link>
      <div className="detail-layout">
        <div className="detail-main">
          <div className="detail-hero">
            <div className="detail-company-mark">
              {(job.company || "C").charAt(0).toUpperCase()}
            </div>
            <div className="detail-company">
              <div className="eyebrow">{job.category} OPPORTUNITY</div>
              <h1>{job.title}</h1>
              <p>
                {job.company} <span>·</span> <MapPin size={15} /> {job.location}
              </p>
            </div>
            <button
              className="save-btn"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(window.location.href);
                  setMessage("Job link copied to clipboard.");
                } catch {
                  setMessage(window.location.href);
                }
              }}
              title="Copy job link"
            >
              <Share2 size={17} />
            </button>
          </div>
          <div className="detail-tags">
            <span>
              <BriefcaseBusiness size={15} />
              {job.type}
            </span>
            <span>
              <Building2 size={15} />
              {job.workplace}
            </span>
            <span>
              <Clock3 size={15} />
              {job.experience}
            </span>
            <span>
              <CalendarDays size={15} />
              {new Date(job.createdAt).toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <section className="detail-section">
            <h2>About this role</h2>
            <p className="job-description">{job.description}</p>
          </section>
          {job.requirements?.length > 0 && (
            <section className="detail-section">
              <h2>What you'll bring</h2>
              <ul className="requirements">
                {job.requirements.map((x, i) => (
                  <li key={i}>
                    <CheckCircle2 size={17} />
                    {x}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {job.skills?.length > 0 && (
            <section className="detail-section">
              <h2>Skills & expertise</h2>
              <div className="skill-cloud">
                {job.skills.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </section>
          )}
          <section className="detail-section">
            <h2>About the company</h2>
            <div className="company-about">
              <div className="company-mark">
                {job.company.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3>{job.company}</h3>
                <p>
                  Connect with the team and explore where your skills can make
                  an impact.
                </p>
              </div>
            </div>
          </section>
        </div>
        <aside className="apply-sidebar">
          <div className="apply-card">
            <span className="apply-label">COMPENSATION</span>
            <h2>
              {job.salaryMax
                ? `${job.currency} ${Number(job.salaryMin || 0).toLocaleString()} – ${Number(job.salaryMax).toLocaleString()}`
                : "Salary negotiable"}
            </h2>
            <p className="muted">
              {job.salaryMax
                ? "Estimated salary range"
                : "Discuss compensation with the employer"}
            </p>
            <div className="apply-divider" />
            <div className="apply-fact">
              <span>
                <MapPin size={16} />
              </span>
              <div>
                <small>Location</small>
                <strong>{job.location}</strong>
              </div>
            </div>
            <div className="apply-fact">
              <span>
                <Wallet size={16} />
              </span>
              <div>
                <small>Employment type</small>
                <strong>{job.type}</strong>
              </div>
            </div>
            <div className="apply-fact">
              <span>
                <Clock3 size={16} />
              </span>
              <div>
                <small>Work arrangement</small>
                <strong>{job.workplace}</strong>
              </div>
            </div>
            {user?.role === "candidate" ? (
              <>
                <label className="field apply-field">
                  <span>
                    Cover letter <small>(optional)</small>
                  </span>
                  <textarea
                    rows="4"
                    maxLength="3000"
                    placeholder="Tell the team why you're a great fit…"
                    value={cover}
                    onChange={(e) => setCover(e.target.value)}
                  />
                </label>
                <label className="field apply-field">
                  <span>
                    Resume URL <small>(optional)</small>
                  </span>
                  <input
                    type="url"
                    placeholder="https://your-resume.pdf"
                    value={resume}
                    onChange={(e) => setResume(e.target.value)}
                  />
                  <small className="field-hint">
                    Use a shareable link, or add one to your profile.
                  </small>
                </label>
                <button
                  className="btn btn-primary btn-full"
                  disabled={busy || Boolean(message.includes("submitted"))}
                  onClick={apply}
                >
                  {busy
                    ? "Submitting…"
                    : message.includes("submitted")
                      ? "Application sent"
                      : "Apply for this role"}{" "}
                  <ArrowRight size={17} />
                </button>
              </>
            ) : user ? (
              <p className="sidebar-note">
                Sign in with a candidate account to apply.
              </p>
            ) : (
              <Link className="btn btn-primary btn-full" to="/login">
                Log in to apply <ArrowRight size={17} />
              </Link>
            )}
            <Alert>{error}</Alert>
            {message && <Alert type="success">{message}</Alert>}
            <p className="apply-privacy">
              Your details are only shared with the hiring team.
            </p>
          </div>
          <div className="safety-note">
            <CheckCircle2 size={18} />
            <p>
              <strong>Keep it professional</strong>
              <br />
              Never share passwords or pay fees to apply for a job.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
