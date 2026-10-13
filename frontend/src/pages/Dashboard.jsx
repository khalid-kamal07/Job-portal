import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  Plus,
  Users,
  FileText,
  ArrowUpRight,
  MoreHorizontal,
  Trash2,
  Edit3,
  Eye,
  ChevronRight,
  Search,
  Send,
  Building2,
  MapPin,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Save,
  X,
} from "lucide-react";
import api, { errorMessage } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { Alert, Empty, Loading, StatusPill } from "../components/Layout";
export function EmployerDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const empty = {
    title: "",
    company: user?.company || "",
    location: "Karachi, Pakistan",
    workplace: "Hybrid",
    type: "Full-time",
    category: "Technology",
    experience: "Entry level",
    salaryMin: "",
    salaryMax: "",
    currency: "PKR",
    description: "",
    requirements: "",
    skills: "",
    status: "active",
  };
  const [form, setForm] = useState(empty);
  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get("/jobs/mine");
      setJobs(r.data.jobs);
      const all = await Promise.all(
        r.data.jobs.map((j) =>
          api
            .get(`/applications/job/${j._id}`)
            .then((x) => x.data.applications)
            .catch(() => []),
        ),
      );
      setApps(all.flat());
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const openCreate = () => {
    setEditing(null);
    setForm({ ...empty, company: user?.company || "" });
    setShowForm(true);
  };
  const openEdit = (job) => {
    setEditing(job);
    setForm({
      ...job,
      salaryMin: job.salaryMin || "",
      salaryMax: job.salaryMax || "",
      requirements: (job.requirements || []).join("\n"),
      skills: (job.skills || []).join(", "),
    });
    setShowForm(true);
  };
  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const payload = {
        ...form,
        salaryMin: Number(form.salaryMin) || 0,
        salaryMax: Number(form.salaryMax) || 0,
        requirements: form.requirements
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      if (editing) await api.patch(`/jobs/${editing._id}`, payload);
      else await api.post("/jobs", payload);
      setMessage(
        editing ? "Job updated successfully." : "Your job is now published.",
      );
      setShowForm(false);
      await load();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };
  const remove = async (job) => {
    if (
      !confirm(
        `Delete “${job.title}” and its applications? This cannot be undone.`,
      )
    )
      return;
    try {
      await api.delete(`/jobs/${job._id}`);
      setMessage("Job deleted.");
      setSelected(null);
      await load();
    } catch (e) {
      setError(errorMessage(e));
    }
  };
  const changeStatus = async (id, status) => {
    try {
      await api.patch(`/applications/${id}`, { status });
      setApps((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
      setMessage("Application status updated.");
    } catch (e) {
      setError(errorMessage(e));
    }
  };
  if (loading)
    return (
      <div className="container dashboard-page">
        <Loading />
      </div>
    );
  return (
    <div className="container dashboard-page">
      <div className="dashboard-heading">
        <div>
          <div className="eyebrow">EMPLOYER WORKSPACE</div>
          <h1>
            Good work starts <span>with your team.</span>
          </h1>
          <p>
            Welcome back, {user?.name?.split(" ")[0]}. Manage roles and meet
            your next great hire.
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={17} /> Post a job
        </button>
      </div>
      <Alert>{error}</Alert>
      {message && <Alert type="success">{message}</Alert>}
      <div className="dashboard-stats">
        <Metric
          icon={<BriefcaseBusiness />}
          label="Total job posts"
          value={jobs.length}
          tone="purple"
        />
        <Metric
          icon={<CheckCircle2 />}
          label="Active listings"
          value={jobs.filter((j) => j.status === "active").length}
          tone="green"
        />
        <Metric
          icon={<FileText />}
          label="Applications"
          value={apps.length}
          tone="blue"
        />
        <Metric
          icon={<Users />}
          label="Shortlisted"
          value={apps.filter((a) => a.status === "Shortlisted").length}
          tone="orange"
        />
      </div>
      <div className="dashboard-columns">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Your job listings</h2>
              <p>Keep your opportunities up to date.</p>
            </div>
            <button className="btn btn-outline btn-small" onClick={openCreate}>
              <Plus size={15} /> New role
            </button>
          </div>
          {jobs.length ? (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Applications</th>
                    <th>Posted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((j) => (
                    <tr key={j._id}>
                      <td>
                        <div className="table-title">
                          <strong>{j.title}</strong>
                          <small>
                            {j.location} · {j.type}
                          </small>
                        </div>
                      </td>
                      <td>
                        <StatusPill status={j.status} />
                      </td>
                      <td>{apps.filter((a) => a.job?._id === j._id).length}</td>
                      <td>
                        {new Date(j.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            title="View applications"
                            onClick={() =>
                              setSelected(selected === j._id ? null : j._id)
                            }
                          >
                            <Eye size={16} />
                          </button>
                          <button title="Edit job" onClick={() => openEdit(j)}>
                            <Edit3 size={16} />
                          </button>
                          <button title="Delete job" onClick={() => remove(j)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty
              title="Your first hire starts here"
              text="Publish a job to start receiving applications."
            />
          )}
        </section>
        <section className="panel applications-panel">
          <div className="panel-heading">
            <div>
              <h2>Recent applications</h2>
              <p>Review candidates and move great people forward.</p>
            </div>
            <span className="count-badge">{apps.length}</span>
          </div>
          {apps.length ? (
            <div className="applicant-list">
              {apps.slice(0, 8).map((a) => (
                <Applicant key={a._id} app={a} onStatus={changeStatus} />
              ))}
            </div>
          ) : (
            <Empty
              title="No applications yet"
              text="Applications will appear here once candidates apply."
            />
          )}
        </section>
      </div>
      {selected && (
        <section className="panel selected-apps">
          <div className="panel-heading">
            <div>
              <h2>
                Applicants for {jobs.find((j) => j._id === selected)?.title}
              </h2>
              <p>Review candidate profiles and application status.</p>
            </div>
            <button className="icon-btn" onClick={() => setSelected(null)}>
              <X size={18} />
            </button>
          </div>
          {apps.filter((a) => a.job?._id === selected).length ? (
            apps
              .filter((a) => a.job?._id === selected)
              .map((a) => (
                <Applicant key={a._id} app={a} onStatus={changeStatus} />
              ))
          ) : (
            <Empty title="No applicants for this role yet" />
          )}
        </section>
      )}
      {showForm && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) =>
            e.target === e.currentTarget && setShowForm(false)
          }
        >
          <div className="modal-card">
            <div className="modal-heading">
              <div>
                <div className="eyebrow">
                  {editing ? "UPDATE LISTING" : "GROW YOUR TEAM"}
                </div>
                <h2>{editing ? "Edit job post" : "Create a job post"}</h2>
                <p>
                  Give candidates the details they need to make a confident
                  decision.
                </p>
              </div>
              <button className="icon-btn" onClick={() => setShowForm(false)}>
                <X />
              </button>
            </div>
            <form className="job-form" onSubmit={save}>
              <Alert>{error}</Alert>
              <div className="form-grid">
                <Field label="Job title *">
                  <input
                    required
                    maxLength="120"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    placeholder="e.g. Frontend Developer"
                  />
                </Field>
                <Field label="Company *">
                  <input
                    required
                    value={form.company}
                    onChange={(e) =>
                      setForm({ ...form, company: e.target.value })
                    }
                    placeholder="Company name"
                  />
                </Field>
                <Field label="Location *">
                  <input
                    required
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    placeholder="Karachi, Pakistan / Remote"
                  />
                </Field>
                <Field label="Category *">
                  <select
                    required
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  >
                    {[
                      "Technology",
                      "Design",
                      "Marketing",
                      "Business",
                      "Customer Support",
                      "Operations",
                      "Finance",
                      "Education",
                      "Healthcare",
                      "Other",
                    ].map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Employment type">
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    {[
                      "Full-time",
                      "Part-time",
                      "Contract",
                      "Internship",
                      "Freelance",
                    ].map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Workplace">
                  <select
                    value={form.workplace}
                    onChange={(e) =>
                      setForm({ ...form, workplace: e.target.value })
                    }
                  >
                    {["Remote", "Hybrid", "On-site"].map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Experience">
                  <select
                    value={form.experience}
                    onChange={(e) =>
                      setForm({ ...form, experience: e.target.value })
                    }
                  >
                    {["Entry level", "1–3 years", "3–5 years", "5+ years"].map(
                      (x) => (
                        <option key={x}>{x}</option>
                      ),
                    )}
                  </select>
                </Field>
                <Field label="Currency">
                  <select
                    value={form.currency}
                    onChange={(e) =>
                      setForm({ ...form, currency: e.target.value })
                    }
                  >
                    {["PKR", "USD", "GBP", "EUR", "AED"].map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Minimum salary">
                  <input
                    type="number"
                    min="0"
                    value={form.salaryMin}
                    onChange={(e) =>
                      setForm({ ...form, salaryMin: e.target.value })
                    }
                    placeholder="e.g. 80000"
                  />
                </Field>
                <Field label="Maximum salary">
                  <input
                    type="number"
                    min="0"
                    value={form.salaryMax}
                    onChange={(e) =>
                      setForm({ ...form, salaryMax: e.target.value })
                    }
                    placeholder="e.g. 150000"
                  />
                </Field>
                <Field label="Skills (comma-separated)">
                  <input
                    value={form.skills}
                    onChange={(e) =>
                      setForm({ ...form, skills: e.target.value })
                    }
                    placeholder="React, Node.js, MongoDB"
                  />
                </Field>
                <Field label="Listing status">
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                  >
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </Field>
                <div className="field span-two">
                  <span>
                    Job description * <small>At least 30 characters</small>
                  </span>
                  <textarea
                    required
                    minLength="30"
                    rows="5"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Describe the role, team, responsibilities, and what success looks like."
                  />
                </div>
                <div className="field span-two">
                  <span>
                    Requirements <small>One requirement per line</small>
                  </span>
                  <textarea
                    rows="3"
                    value={form.requirements}
                    onChange={(e) =>
                      setForm({ ...form, requirements: e.target.value })
                    }
                    placeholder={
                      "Strong communication skills\nRelevant experience or portfolio\nComfort working with a team"
                    }
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" disabled={busy}>
                  {busy ? "Saving…" : editing ? "Save changes" : "Publish job"}{" "}
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
function Applicant({ app, onStatus }) {
  const name = app.candidate?.name || "Candidate";
  return (
    <div className="applicant">
      <div className="avatar applicant-avatar">
        {name.charAt(0).toUpperCase()}
      </div>
      <div className="applicant-info">
        <strong>{name}</strong>
        <small>
          {app.job?.title || "Job application"} ·{" "}
          {new Date(app.createdAt).toLocaleDateString()}
        </small>
        {app.candidate?.email && <small>{app.candidate.email}</small>}
        {app.coverLetter && <p className="cover-preview">{app.coverLetter}</p>}
        {app.resumeUrl && (
          <a
            className="resume-link"
            href={app.resumeUrl}
            target="_blank"
            rel="noreferrer"
          >
            View resume <ExternalLink size={13} />
          </a>
        )}
      </div>
      <div className="applicant-actions">
        <StatusPill status={app.status} />
        <select
          aria-label={`Update ${name} status`}
          value={app.status}
          onChange={(e) => onStatus(app._id, e.target.value)}
        >
          {["Submitted", "Reviewing", "Shortlisted", "Rejected", "Hired"].map(
            (s) => (
              <option key={s}>{s}</option>
            ),
          )}
        </select>
      </div>
    </div>
  );
}
function Metric({ icon, label, value, tone }) {
  return (
    <div className="metric-card">
      <span className={`metric-icon metric-${tone}`}>{icon}</span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
      <span className="metric-decoration" />
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
export function CandidateApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    api
      .get("/applications/mine")
      .then((r) => setApps(r.data.applications))
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="container dashboard-page">
      <div className="dashboard-heading">
        <div>
          <div className="eyebrow">YOUR CAREER JOURNEY</div>
          <h1>
            My <span>applications.</span>
          </h1>
          <p>Keep track of every opportunity you've taken a step toward.</p>
        </div>
        <Link className="btn btn-primary" to="/jobs">
          Explore jobs <ArrowUpRight size={17} />
        </Link>
      </div>
      <Alert>{error}</Alert>
      {loading ? (
        <Loading />
      ) : apps.length ? (
        <div className="my-applications">
          {apps.map((a) => (
            <div className="my-application-card" key={a._id}>
              <div className="company-mark">
                {(a.job?.company || "C").charAt(0).toUpperCase()}
              </div>
              <div className="my-app-info">
                <h3>{a.job?.title || "Job no longer available"}</h3>
                <p>
                  {a.job?.company || "Company"} · {a.job?.location || "—"}
                </p>
                <small>
                  Applied{" "}
                  {new Date(a.createdAt).toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </small>
              </div>
              <div className="my-app-end">
                <StatusPill status={a.status} />
                {a.job && (
                  <Link to={`/jobs/${a.job._id}`} className="text-link">
                    View job <ArrowUpRight size={14} />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="panel">
          <Empty
            title="Your next opportunity is waiting"
            text="You haven't applied to a role yet. Let's change that."
          />
          <div className="center-action">
            <Link to="/jobs" className="btn btn-primary">
              Find jobs <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
export function AdminDashboard() {
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const load = async () => {
    setLoading(true);
    try {
      const [d, u, a] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/users"),
        api.get("/applications/all"),
      ]);
      setData(d.data);
      setUsers(u.data.users);
      setApps(a.data.applications);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const role = async (id, value) => {
    try {
      await api.patch(`/admin/users/${id}/role`, { role: value });
      setUsers((p) => p.map((u) => (u._id === id ? { ...u, role: value } : u)));
      setMessage("User role updated.");
    } catch (e) {
      setError(errorMessage(e));
    }
  };
  const remove = async (u) => {
    if (!confirm(`Delete ${u.name} and their related jobs/applications?`))
      return;
    try {
      await api.delete(`/admin/users/${u._id}`);
      setUsers((p) => p.filter((x) => x._id !== u._id));
      setMessage("User deleted.");
    } catch (e) {
      setError(errorMessage(e));
    }
  };
  if (loading)
    return (
      <div className="container dashboard-page">
        <Loading />
      </div>
    );
  return (
    <div className="container dashboard-page">
      <div className="dashboard-heading">
        <div>
          <div className="eyebrow">PLATFORM CONTROL CENTER</div>
          <h1>
            Admin <span>overview.</span>
          </h1>
          <p>Monitor platform activity and manage members from one place.</p>
        </div>
        <button className="btn btn-outline" onClick={load}>
          <Clock3 size={16} /> Refresh data
        </button>
      </div>
      <Alert>{error}</Alert>
      {message && <Alert type="success">{message}</Alert>}
      <div className="dashboard-stats">
        <Metric
          icon={<Users />}
          label="Total users"
          value={data?.stats.users || 0}
          tone="purple"
        />
        <Metric
          icon={<Users />}
          label="Candidates"
          value={data?.stats.candidates || 0}
          tone="green"
        />
        <Metric
          icon={<Building2 />}
          label="Employers"
          value={data?.stats.employers || 0}
          tone="blue"
        />
        <Metric
          icon={<BriefcaseBusiness />}
          label="All job posts"
          value={data?.stats.jobs || 0}
          tone="orange"
        />
        <Metric
          icon={<CheckCircle2 />}
          label="Active jobs"
          value={data?.stats.activeJobs || 0}
          tone="green"
        />
        <Metric
          icon={<FileText />}
          label="Applications"
          value={data?.stats.applications || 0}
          tone="purple"
        />
      </div>
      <section className="panel admin-users-panel">
        <div className="panel-heading">
          <div>
            <h2>Manage users</h2>
            <p>Update access levels or remove accounts.</p>
          </div>
          <span className="count-badge">{users.length} members</span>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Joined</th>
                <th>Role</th>
                <th>Account actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div className="member-cell">
                      <span className="avatar">
                        {u.name.charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <strong>{u.name}</strong>
                        <small>{u.email}</small>
                      </div>
                    </div>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={u.role}
                      onChange={(e) => role(u._id, e.target.value)}
                      aria-label={`Role for ${u.name}`}
                    >
                      <option value="candidate">Candidate</option>
                      <option value="employer">Employer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className="danger-text-btn"
                      onClick={() => remove(u)}
                    >
                      <Trash2 size={15} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="panel admin-users-panel">
        <div className="panel-heading">
          <div>
            <h2>Recent applications</h2>
            <p>Platform-wide application activity.</p>
          </div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Position</th>
                <th>Company</th>
                <th>Status</th>
                <th>Applied</th>
              </tr>
            </thead>
            <tbody>
              {apps.slice(0, 25).map((a) => (
                <tr key={a._id}>
                  <td>{a.candidate?.name || "Deleted user"}</td>
                  <td>{a.job?.title || "Deleted job"}</td>
                  <td>{a.job?.company || "—"}</td>
                  <td>
                    <StatusPill status={a.status} />
                  </td>
                  <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
