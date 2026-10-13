# Vercel deployment checklist

- [ ] MongoDB Atlas database and least-privilege database user are configured.
- [ ] Backend Vercel root directory is `backend`.
- [ ] Backend environment variables `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`, and `CLIENT_URL` are configured.
- [ ] Backend `/api/health` returns `{ "status": "ok", ... }`.
- [ ] Admin seed script was run securely against the production database, or an admin was created manually in a trusted environment.
- [ ] Frontend Vercel root directory is `frontend`.
- [ ] Frontend `VITE_API_URL` points to the deployed backend and ends with `/api`.
- [ ] Frontend production URL is included in backend `CLIENT_URL`.
- [ ] Candidate registration/login, employer registration/login, job posting, applying, application status updates, and admin management were tested on production.
- [ ] Default seed admin password was changed and secrets are not committed to Git.
