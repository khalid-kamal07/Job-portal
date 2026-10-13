import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Save, UserRound, ArrowLeft, CheckCircle2 } from "lucide-react";
import api, { errorMessage } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { Alert, Loading } from "../components/Layout";
export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    name: "",
    headline: "",
    location: "",
    skills: "",
    resumeUrl: "",
    company: "",
  });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    api
      .get("/auth/me")
      .then(({ data }) => {
        const u = data.user;
        setForm({
          name: u.name || "",
          headline: u.headline || "",
          location: u.location || "",
          skills: (u.skills || []).join(", "),
          resumeUrl: u.resumeUrl || "",
          company: u.company || "",
        });
      })
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false));
  }, []);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await api.patch("/auth/profile", {
        ...form,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      await refreshUser();
      setMessage("Your profile has been saved.");
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };
  if (loading)
    return (
      <div className="container dashboard-page">
        <Loading />
      </div>
    );
  return (
    <div className="container profile-page">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} /> Back to home
      </Link>
      <div className="profile-heading">
        <div className="avatar profile-avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="eyebrow">YOUR ACCOUNT</div>
          <h1>Profile settings</h1>
          <p>
            Keep your information current so the right opportunities find you.
          </p>
        </div>
      </div>
      <form className="panel profile-form" onSubmit={submit}>
        <Alert>{error}</Alert>
        {message && <Alert type="success">{message}</Alert>}
        <div className="profile-section-heading">
          <UserRound size={18} />
          <div>
            <h2>Personal information</h2>
            <p>These details help teams get to know you.</p>
          </div>
        </div>
        <div className="form-grid">
          <Field label="Full name *">
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="Email address">
            <input disabled value={user?.email || ""} />
          </Field>
          <Field label="Professional headline">
            <input
              maxLength="140"
              value={form.headline}
              onChange={(e) => setForm({ ...form, headline: e.target.value })}
              placeholder="e.g. Full Stack Developer"
            />
          </Field>
          <Field label="Location">
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. Karachi, Pakistan"
            />
          </Field>
          {user?.role === "employer" && (
            <Field label="Company name">
              <input
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </Field>
          )}
          {user?.role === "candidate" && (
            <>
              <div className="field span-two">
                <span>
                  Skills <small>Separate each skill with a comma</small>
                </span>
                <input
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  placeholder="React, Node.js, MongoDB"
                />
              </div>
              <div className="field span-two">
                <span>
                  Resume link{" "}
                  <small>Share a link to your PDF or portfolio</small>
                </span>
                <input
                  type="url"
                  value={form.resumeUrl}
                  onChange={(e) =>
                    setForm({ ...form, resumeUrl: e.target.value })
                  }
                  placeholder="https://example.com/resume.pdf"
                />
              </div>
            </>
          )}
        </div>
        <div className="profile-bottom">
          <p>
            <CheckCircle2 size={15} /> Your information is only used to support
            your job search.
          </p>
          <button className="btn btn-primary" disabled={busy}>
            {busy ? "Saving…" : "Save profile"} <Save size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}
