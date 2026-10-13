import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  BriefcaseBusiness,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Alert } from "../components/Layout";
import { errorMessage } from "../utils/api";
export function Login() {
  const { signIn } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const user = await signIn("login", form);
      nav(
        user.role === "admin"
          ? "/admin"
          : user.role === "employer"
            ? "/dashboard"
            : "/jobs",
      );
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <AuthFrame
      title="Welcome back."
      subtitle="Your next opportunity is waiting."
      sideTitle="A better job search starts here."
      sideText="Find roles that fit your skills, your goals, and the life you want to build."
    >
      <form className="form-stack" onSubmit={submit}>
        <Alert>{error}</Alert>
        <Field label="Email address">
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            value={form.email}
            onChange={change}
          />
        </Field>
        <Field label="Password">
          <div className="password-wrap">
            <input
              name="password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="Enter your password"
              value={form.password}
              onChange={change}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              aria-label="Toggle password visibility"
            >
              {show ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </Field>
        <button className="btn btn-primary btn-full" disabled={busy}>
          {busy ? "Signing in…" : "Log in"} <ArrowRight size={17} />
        </button>
        <p className="form-foot">
          New to TalentBridge? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </AuthFrame>
  );
}
export function Register() {
  const { signIn } = useAuth();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [role, setRole] = useState(
    params.get("role") === "employer" ? "employer" : "candidate",
  );
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
  });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const user = await signIn("register", { ...form, role });
      nav(user.role === "employer" ? "/dashboard" : "/jobs");
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <AuthFrame
      title="Let's get you started."
      subtitle="A few details and you're on your way."
      sideTitle="Make your next move count."
      sideText="Join a community where talent meets opportunity, and good work finds the right people."
    >
      <form className="form-stack" onSubmit={submit}>
        <Alert>{error}</Alert>
        <div className="role-switch">
          <button
            type="button"
            className={role === "candidate" ? "selected" : ""}
            onClick={() => setRole("candidate")}
          >
            <span>I'm looking for a job</span>
            <small>Find roles and apply</small>
          </button>
          <button
            type="button"
            className={role === "employer" ? "selected" : ""}
            onClick={() => setRole("employer")}
          >
            <span>I'm hiring</span>
            <small>Build your team</small>
          </button>
        </div>
        <Field label="Full name">
          <input
            name="name"
            required
            minLength="2"
            autoComplete="name"
            placeholder="Your full name"
            value={form.name}
            onChange={change}
          />
        </Field>
        <Field label="Email address">
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={change}
          />
        </Field>
        {role === "employer" && (
          <Field label="Company name">
            <input
              name="company"
              required
              placeholder="Your company"
              value={form.company}
              onChange={change}
            />
          </Field>
        )}
        <Field label="Password">
          <div className="password-wrap">
            <input
              name="password"
              type={show ? "text" : "password"}
              minLength="8"
              required
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={change}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              aria-label="Toggle password visibility"
            >
              {show ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </Field>
        <button className="btn btn-primary btn-full" disabled={busy}>
          {busy ? "Creating account…" : "Create account"}{" "}
          <ArrowRight size={17} />
        </button>
        <p className="form-foot">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
        <p className="terms-note">
          <CheckCircle2 size={14} /> By continuing, you agree to use
          TalentBridge respectfully.
        </p>
      </form>
    </AuthFrame>
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
function AuthFrame({ title, subtitle, sideTitle, sideText, children }) {
  return (
    <div className="auth-layout">
      <aside className="auth-side">
        <Link className="brand brand-light" to="/">
          <span className="brand-icon">
            <BriefcaseBusiness size={21} />
          </span>
          talent<span>bridge</span>
        </Link>
        <div className="auth-side-content">
          <div className="eyebrow">
            <span className="live-dot" /> YOUR CAREER, YOUR WAY
          </div>
          <h2>{sideTitle}</h2>
          <p>{sideText}</p>
          <div className="auth-checks">
            <span>
              <CheckCircle2 size={17} /> Thoughtful opportunities
            </span>
            <span>
              <CheckCircle2 size={17} /> Simple applications
            </span>
            <span>
              <CheckCircle2 size={17} /> Real career momentum
            </span>
          </div>
        </div>
        <small className="auth-side-foot">
          A little closer to what's next.
        </small>
      </aside>
      <main className="auth-main">
        <div className="auth-form-wrap">
          <div className="mobile-auth-brand">
            <Link className="brand" to="/">
              <span className="brand-icon">
                <BriefcaseBusiness size={21} />
              </span>
              talent<span>bridge</span>
            </Link>
          </div>
          <div className="auth-heading">
            <div className="eyebrow">WELCOME TO TALENTBRIDGE</div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
