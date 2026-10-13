import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowRight,
  BriefcaseBusiness,
  Clock3,
  ChevronLeft,
  ChevronRight,
  X,
  Building2,
} from "lucide-react";
import api, { errorMessage } from "../utils/api";
import { Empty, Loading, Alert } from "../components/Layout";
const types = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"];
const workplaces = ["Remote", "Hybrid", "On-site"];
const categories = [
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
];
export default function Jobs() {
  const [params, setParams] = useSearchParams();
  const [form, setForm] = useState({
    search: params.get("search") || "",
    location: params.get("location") || "",
    type: params.get("type") || "",
    workplace: params.get("workplace") || "",
    category: params.get("category") || "",
    experience: params.get("experience") || "",
    sort: params.get("sort") || "newest",
  });
  const [data, setData] = useState({
    jobs: [],
    pagination: { page: 1, pages: 1, total: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(Number(params.get("page")) || 1);
  const fetch = async () => {
    setLoading(true);
    setError("");
    try {
      const q = new URLSearchParams({
        ...Object.fromEntries(Object.entries(form).filter(([, v]) => v)),
        page: String(page),
        limit: "12",
      });
      setParams(q, { replace: true });
      const r = await api.get(`/jobs?${q}`);
      setData(r.data);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetch();
  }, [page]);
  const submit = (e) => {
    e.preventDefault();
    setPage(1);
    fetch();
  };
  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const clear = () => {
    setForm({
      search: "",
      location: "",
      type: "",
      workplace: "",
      category: "",
      experience: "",
      sort: "newest",
    });
    setPage(1);
    setParams({});
  };
  return (
    <div className="jobs-page container">
      <div className="jobs-heading">
        <div>
          <div className="eyebrow">THE RIGHT ROLE IS OUT THERE</div>
          <h1>
            Find your next <span>opportunity.</span>
          </h1>
          <p>Search thoughtful opportunities from teams ready to meet you.</p>
        </div>
        <div className="jobs-heading-art">
          <BriefcaseBusiness size={35} />
        </div>
      </div>
      <form className="jobs-searchbar" onSubmit={submit}>
        <label>
          <Search size={19} />
          <input
            placeholder="Job title, skill, company"
            value={form.search}
            onChange={(e) => update("search", e.target.value)}
          />
        </label>
        <span className="search-divider" />
        <label>
          <MapPin size={19} />
          <input
            placeholder="City, country or remote"
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
          />
        </label>
        <button className="btn btn-primary">
          <Search size={17} /> Search
        </button>
      </form>
      <div className="jobs-content">
        <aside
          className={`filter-sidebar ${filtersOpen ? "filters-open" : ""}`}
        >
          <div className="filter-title">
            <h3>
              <SlidersHorizontal size={17} /> Filters
            </h3>
            <button onClick={clear}>Clear all</button>
            <button
              className="close-filters"
              onClick={() => setFiltersOpen(false)}
            >
              <X size={17} />
            </button>
          </div>
          <FilterGroup title="Workplace">
            <RadioList
              values={workplaces}
              selected={form.workplace}
              onChange={(v) =>
                update("workplace", form.workplace === v ? "" : v)
              }
            />
          </FilterGroup>
          <FilterGroup title="Job type">
            <RadioList
              values={types}
              selected={form.type}
              onChange={(v) => update("type", form.type === v ? "" : v)}
            />
          </FilterGroup>
          <FilterGroup title="Category">
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </FilterGroup>
          <FilterGroup title="Experience">
            <select
              value={form.experience}
              onChange={(e) => update("experience", e.target.value)}
            >
              <option value="">Any experience</option>
              {["Entry level", "1–3 years", "3–5 years", "5+ years"].map(
                (x) => (
                  <option key={x}>{x}</option>
                ),
              )}
            </select>
          </FilterGroup>
          <button
            className="btn btn-primary btn-full apply-filters"
            onClick={() => {
              setPage(1);
              fetch();
              setFiltersOpen(false);
            }}
          >
            Apply filters
          </button>
        </aside>
        <section className="job-results">
          <div className="results-toolbar">
            <div>
              <h2>
                Available positions <span>({data.pagination.total})</span>
              </h2>
              <p>Find the role that feels right for you.</p>
            </div>
            <div className="results-actions">
              <button
                className="filter-mobile btn btn-outline"
                onClick={() => setFiltersOpen(true)}
              >
                <SlidersHorizontal size={16} /> Filters
              </button>
              <label className="sort-select">
                <ArrowUpDown size={15} />
                <select
                  value={form.sort}
                  onChange={(e) => {
                    update("sort", e.target.value);
                    setPage(1);
                    setTimeout(fetch, 0);
                  }}
                >
                  <option value="newest">Most relevant</option>
                  <option value="oldest">Oldest first</option>
                  <option value="salary">Highest salary</option>
                </select>
              </label>
            </div>
          </div>
          <Alert>{error}</Alert>
          {loading ? (
            <Loading />
          ) : (
            <>
              <div className="job-list">
                {data.jobs.map((job) => (
                  <JobRow key={job._id} job={job} />
                ))}
                {!data.jobs.length && (
                  <Empty
                    title="No matching jobs yet"
                    text="Try a different keyword or remove some filters."
                  />
                )}
              </div>
              {data.pagination.pages > 1 && (
                <div className="pagination">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft size={17} /> Previous
                  </button>
                  <span>
                    Page <strong>{page}</strong> of {data.pagination.pages}
                  </span>
                  <button
                    disabled={page >= data.pagination.pages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next <ChevronRight size={17} />
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
function FilterGroup({ title, children }) {
  return (
    <div className="filter-group">
      <h4>{title}</h4>
      {children}
    </div>
  );
}
function RadioList({ values, selected, onChange }) {
  return (
    <div className="radio-list">
      {values.map((v) => (
        <button
          type="button"
          key={v}
          className={selected === v ? "radio-option chosen" : "radio-option"}
          onClick={() => onChange(v)}
        >
          <span className="radio-dot" />
          {v}
        </button>
      ))}
    </div>
  );
}
function JobRow({ job }) {
  return (
    <Link to={`/jobs/${job._id}`} className="job-row">
      <div className="company-mark row-mark">
        {(job.company || "C").charAt(0).toUpperCase()}
      </div>
      <div className="job-row-main">
        <div className="job-row-title">
          <h3>{job.title}</h3>
          {job.featured && <span className="tag tag-purple">Featured</span>}
        </div>
        <p className="company-name">
          <Building2 size={14} /> {job.company} <span>·</span>{" "}
          <MapPin size={14} /> {job.location}
        </p>
        <div className="job-tags">
          <span>{job.type}</span>
          <span>{job.workplace}</span>
          <span>{job.category}</span>
        </div>
        <div className="job-row-meta">
          <span>
            <Clock3 size={13} /> Posted{" "}
            {new Date(job.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </span>
          <span>{job.experience}</span>
        </div>
      </div>
      <div className="job-row-end">
        <strong>
          {job.salaryMax
            ? `${job.currency} ${Number(job.salaryMin || 0).toLocaleString()} – ${Number(job.salaryMax).toLocaleString()}`
            : "Salary negotiable"}
        </strong>
        <span className="row-arrow">
          <ArrowRight size={17} />
        </span>
      </div>
    </Link>
  );
}
