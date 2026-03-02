 Scentora – Deploy in 3 Steps (First-Time Friendly)

Deploy the full MERN app with **MongoDB Atlas** (database), **Render** (backend), and **Vercel** (frontend). All have free tiers and no credit card needed for basic use.
git add .
git commit -m "Initial commit - Scentora MERN app"
git branch -M main
git remote add origin https://github.com/mahnoor-hafeez/Scentora.git
git push -u origin main
---

## Before You Start

- Push your project to **GitHub** (create a repo and push your `TASK2` code).
- Have your **backend** and **frontend** working locally.

---

## Step 1: Database – MongoDB Atlas (Free)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign up (free).
2. Create a **free M0 cluster** (e.g. region closest to you).
3. Create a database user:
   - **Database Access** → **Add New Database User** → set username and password (save them).
4. Allow network access:
   - **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (0.0.0.0/0) for simplicity.
5. Get the connection string:
   - **Database** → **Connect** → **Connect your application** → copy the URI.
   - It looks like: `mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/`
   - Replace `<password>` with your actual password. Add a database name at the end, e.g. `scentora`:
     - `mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/scentora`
   - **Save this** – you’ll use it in Step 2.

---

## Step 2: Backend – Render (Free)

1. Go to [render.com](https://render.com) and sign up (GitHub is easiest).
2. **New** → **Web Service**.
3. Connect your **GitHub repo** and select the Scentora project.
4. Configure:
   - **Name**: e.g. `scentora-api`
   - **Root Directory**: `backend` (so Render runs the Node app in the `backend` folder).
   - **Runtime**: Node.
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. **Environment Variables** – add these (use “Add Environment Variable”):

   | Key           | Value |
   |---------------|--------|
   | `MONGODB_URI` | Your Atlas URI from Step 1 (e.g. `mongodb+srv://.../scentora`) |
   | `JWT_SECRET`  | A long random string (e.g. generate one at [randomkeygen.com](https://randomkeygen.com)) |
   | `JWT_EXPIRE`  | `7d` |
   | `NODE_ENV`    | `production` |
   | `CLIENT_URL`  | Leave empty for now; add after Step 3 (your Vercel URL). |

6. Click **Create Web Service**. Wait for the first deploy to finish.
7. Copy your backend URL, e.g. `https://scentora-api.onrender.com` (no trailing slash).
8. **Optional**: Run the seed script once to add admin and sample data:
   - In the **Shell** tab (or use Render’s run command): run `node scripts/seed.js` from the `backend` directory.  
   - Or run `npm run seed` locally with `MONGODB_URI` set to your Atlas URI so the same DB gets seeded.

---

## Step 3: Frontend – Vercel (Free)

1. Go to [vercel.com](https://vercel.com) and sign up (GitHub is easiest).
2. **Add New** → **Project** → import the **same GitHub repo**.
3. Configure:
   - **Root Directory**: set to `frontend` (click “Edit” and choose the `frontend` folder).
   - **Framework Preset**: Vite (should be auto-detected).
   - **Build Command**: `npm run build` (default).
   - **Output Directory**: `dist` (default for Vite).
4. **Environment Variables** – add:

   | Key                   | Value |
   |-----------------------|--------|
   | `VITE_API_BASE_URL`   | Your Render backend URL from Step 2, e.g. `https://scentora.onrender.com` (no trailing slash) |

   **Important:** This variable is baked into the frontend at **build time**. If you add or change it later, you **must redeploy** (Deployments → Redeploy) so the new build includes it. Otherwise the site will call your own domain (`/api`) and show no data.
5. Click **Deploy**. Wait for the build to finish.
6. Copy your frontend URL, e.g. `https://scentora-xxx.vercel.app`.

---

## Step 4: Connect Backend and Frontend

1. **Render** (backend):
   - Open your Web Service → **Environment**.
   - Set `CLIENT_URL` to your Vercel URL, e.g. `https://scentora-xxx.vercel.app` (no trailing slash).
   - Save; Render will redeploy.
2. **Vercel** (frontend):
   - You already set `VITE_API_BASE_URL` in Step 3. If you change the backend URL later, update it here and redeploy.

---

## Step 5: Test the Live App

- Open your **Vercel URL** in the browser.
- Log in with the seeded admin: `admin@scentora.com` / `admin123` (if you ran the seed).
- Try: products, cart, checkout, and (if you seeded) seller login.

---

## Notes

- **Render free tier**: The backend may “spin down” after ~15 minutes of no traffic. The first request after that can take 30–60 seconds to wake up.
- **Images**: Product images uploaded after deploy are stored on Render’s disk. On free tier, the filesystem is ephemeral, so uploads can be lost on redeploy. For a permanent fix later, use cloud storage (e.g. Cloudinary, S3).
- **HTTPS**: Both Render and Vercel serve over HTTPS; your app is configured to work with that.

---

## Quick Reference

| Service   | Purpose   | URL you get |
|----------|-----------|-------------|
| MongoDB Atlas | Database | Connection string (e.g. `mongodb+srv://.../scentora`) |
| Render    | Backend API | e.g. `https://scentora-api.onrender.com` |
| Vercel    | Frontend   | e.g. `https://scentora-xxx.vercel.app` |

**Backend env:** `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRE`, `NODE_ENV`, `CLIENT_URL`  
**Frontend env:** `VITE_API_BASE_URL`

That’s it. You now have Scentora running on the internet.


