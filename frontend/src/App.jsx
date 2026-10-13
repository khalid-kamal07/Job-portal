import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PageShell, Protected } from "./components/Layout";
import Home from "./pages/Home";
import { Login, Register } from "./pages/Auth";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import {
  EmployerDashboard,
  CandidateApplications,
  AdminDashboard,
} from "./pages/Dashboard";
import Profile from "./pages/Profile";
import "./styles.css";
function Wrapped({ children }) {
  return <PageShell>{children}</PageShell>;
}
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <Wrapped>
                <Home />
              </Wrapped>
            }
          />
          <Route
            path="/jobs"
            element={
              <Wrapped>
                <Jobs />
              </Wrapped>
            }
          />
          <Route
            path="/jobs/:id"
            element={
              <Wrapped>
                <JobDetail />
              </Wrapped>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={
              <Wrapped>
                <Protected>
                  <Profile />
                </Protected>
              </Wrapped>
            }
          />
          <Route
            path="/dashboard"
            element={
              <Wrapped>
                <Protected roles={["employer", "admin"]}>
                  <EmployerDashboard />
                </Protected>
              </Wrapped>
            }
          />
          <Route
            path="/applications"
            element={
              <Wrapped>
                <Protected roles={["candidate"]}>
                  <CandidateApplications />
                </Protected>
              </Wrapped>
            }
          />
          <Route
            path="/admin"
            element={
              <Wrapped>
                <Protected roles={["admin"]}>
                  <AdminDashboard />
                </Protected>
              </Wrapped>
            }
          />
          <Route
            path="*"
            element={
              <Wrapped>
                <div className="not-found">
                  <span>404</span>
                  <h1>Looks like you're off the map.</h1>
                  <p>
                    This page doesn't exist, but your next opportunity might.
                  </p>
                  <a href="/" className="btn btn-primary">
                    Back to home
                  </a>
                </div>
              </Wrapped>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
