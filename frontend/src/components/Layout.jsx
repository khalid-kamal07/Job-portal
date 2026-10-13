import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  Menu,
  X,
  UserRound,
  LogOut,
  LayoutDashboard,
  Plus,
  Bookmark,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
export function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const leave = () => {
    logout();
    setOpen(false);
    navigate("/");
  };
  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link className="brand" to="/">
          <span className="brand-icon">
            <BriefcaseBusiness size={21} />
          </span>
          talent<span>bridge</span>
        </Link>
        <button
          className="mobile-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav className={open ? "nav-links open" : "nav-links"}>
          <NavLink to="/jobs" onClick={() => setOpen(false)}>
            Find jobs
          </NavLink>
          {user?.role === "employer" && (
            <NavLink to="/dashboard" onClick={() => setOpen(false)}>
              Employer dashboard
            </NavLink>
          )}
          {user?.role === "candidate" && (
            <NavLink to="/applications" onClick={() => setOpen(false)}>
              My applications
            </NavLink>
          )}
          {user?.role === "admin" && (
            <NavLink to="/admin" onClick={() => setOpen(false)}>
              Admin
            </NavLink>
          )}
          {user ? (
            <div className="user-nav">
              <span className="avatar">
                {user.name?.charAt(0)?.toUpperCase()}
              </span>
              <span className="user-nav-name">{user.name.split(" ")[0]}</span>
              <button className="icon-btn" onClick={leave} title="Sign out">
                <LogOut size={17} />
              </button>
            </div>
          ) : (
            <div className="nav-actions">
              <Link className="btn btn-ghost" to="/login">
                Log in
              </Link>
              <Link className="btn btn-primary" to="/register">
                Get started <ChevronDown size={15} />
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <Link className="brand" to="/">
          <span className="brand-icon">
            <BriefcaseBusiness size={19} />
          </span>
          talent<span>bridge</span>
        </Link>
        <p>Good work starts with the right connection.</p>
        <span>© {new Date().getFullYear()} TalentBridge</span>
      </div>
    </footer>
  );
}
export function PageShell({ children }) {
  return (
    <>
      <Navbar />
      <main className="main-content">{children}</main>
      <Footer />
    </>
  );
}
export function Loading() {
  return (
    <div className="loading">
      <span className="spinner" /> Loading your workspace…
    </div>
  );
}
export function Empty({
  title = "Nothing here yet",
  text = "Try changing your filters or check back soon.",
}) {
  return (
    <div className="empty">
      <div className="empty-icon">
        <BriefcaseBusiness size={26} />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
export function Alert({ type = "error", children }) {
  if (!children) return null;
  return <div className={`alert alert-${type}`}>{children}</div>;
}
export function Protected({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user)
    return (
      <div className="auth-required">
        <h2>Sign in to continue</h2>
        <p>Create an account or log in to access this page.</p>
        <Link className="btn btn-primary" to="/login">
          Log in
        </Link>
      </div>
    );
  if (roles && !roles.includes(user.role))
    return (
      <div className="auth-required">
        <h2>This page isn't available for your account</h2>
        <Link className="btn btn-primary" to="/">
          Back to home
        </Link>
      </div>
    );
  return children;
}
export function StatusPill({ status }) {
  return (
    <span
      className={`status-pill status-${String(status || "active")
        .toLowerCase()
        .replace(/\s/g, "-")}`}
    >
      {status}
    </span>
  );
}
