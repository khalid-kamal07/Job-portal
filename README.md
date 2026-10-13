# TalentBridge — MERN Job Portal

A full-stack job portal built with MongoDB, Express, React, and Node.js. Includes candidate, employer, and administrator workflows; searchable job listings; applications and status tracking; profile management; and responsive dashboards.

## Features

### Candidates

- Register/login with hashed passwords and JWT sessions.
- Browse jobs with keyword, location, workplace, job type, category, experience, and sorting filters.
- View complete job details, requirements, salary range, and skills.
- Apply once per job with an optional cover letter and resume URL.
- Track application status and update profile, skills, location, headline, and resume link.

### Employers

- Employer registration with company name.
- Create, edit, close/reopen, and delete job listings.
- Review applicants, view candidate details/resume links, and update application status (Submitted, Reviewing, Shortlisted, Rejected, Hired).
- Dashboard metrics and job-specific application lists.

### Admin

- Platform statistics, member management, role updates, user deletion, and platform-wide application overview.
- Admin is created through the seed script, not through public registration.

### Engineering

- Reusable React components, Auth Context, protected routes, server-side role checks, validation, API error handling, rate-limited auth endpoints, database indexes, pagination, and a health endpoint.
- Vercel serverless API adapter and SPA rewrite configuration.

## Requirements

- Node.js 20+ recommended
- MongoDB local instance or MongoDB Atlas database
- npm

## Run locally

Open two terminals.

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Set `MONGODB_URI` and a long random `JWT_SECRET` in `backend/.env`.

```bash
npm run dev
```

API runs at `http://localhost:5000`; health check: `http://localhost:5000/api/health`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173`.

### 3. Seed sample jobs and the first admin

After configuring the backend `.env`, run:

```bash
cd backend
npm run seed
```

By default this creates an admin at `admin@talentbridge.local` with password `ChangeThisPassword123!`, plus sample listings and a sample employer. **Change the default admin password before exposing the app publicly.** You can set `ADMIN_EMAIL`, `ADMIN_NAME`, and `ADMIN_PASSWORD` in the environment before seeding. The script only inserts sample jobs if the jobs collection is empty.

## Deploy to Vercel

Deploy the frontend and backend as **two Vercel projects**. This keeps the SPA build and Node API deployment straightforward.

### Backend project

1. Push the repository to GitHub.
2. In Vercel, import the repo and set the **Root Directory** to `backend`.
3. Deploy with the included `backend/vercel.json` and `backend/api/index.js`.
4. Add environment variables in Vercel Project Settings:
   - `MONGODB_URI` — MongoDB Atlas connection string (allow Vercel network access in Atlas as appropriate).
   - `JWT_SECRET` — long, unique random secret.
   - `NODE_ENV` — `production`.
   - `CLIENT_URL` — the deployed frontend URL (you can include comma-separated allowed origins).
5. Redeploy after setting environment variables. API routes use `/api/...`; verify `/api/health`.

### Frontend project

1. Import the same repository as another Vercel project and set **Root Directory** to `frontend`.
2. Framework preset: Vite. Build command `npm run build`; output directory `dist`.
3. Add `VITE_API_URL` with your deployed backend base URL ending in `/api`, for example `https://your-api.vercel.app/api`.
4. Deploy. The included `frontend/vercel.json` rewrites SPA routes to `index.html`.
5. Set the backend's `CLIENT_URL` to this frontend's production URL and redeploy the backend.

If you use a Vercel preview URL, add that exact origin to `CLIENT_URL` or use a separate preview backend environment. Do not put secrets in `VITE_*` variables; frontend variables are public.

## Notes / production checklist

- Resume fields accept shareable HTTPS URLs. This starter does not upload resume files itself; integrate Cloudinary or S3 if you need direct file uploads.
- Email verification, password reset, and transactional email are not included because they require an email provider and token lifecycle.
- The seed admin password is for initial setup only. For production, use a strong secret and unique admin credentials.
- Set appropriate MongoDB Atlas network access and database-user permissions.
- Add a privacy policy, terms, and any applicable local compliance before public launch.
