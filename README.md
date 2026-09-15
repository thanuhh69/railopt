# RAILOPT — Automatic Railway Maintenance Block Planning System

**Smart India Hackathon (SIH) Enterprise Platform**

RAILOPT is an intelligent railway maintenance block planning platform designed to coordinate maintenance tasks across Engineering, Traction Distribution (TRD), and Signal & Telecommunication (S&T) departments alongside corridor availability windows and train timetables.

---

## 🚀 Cloud Deployment Guide (Render & Vercel)

### 1. Backend Deployment on Render (Node.js API)

1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
2. Connect your GitHub repository: `https://github.com/thanuhh69/railopt`.
3. Configure the Web Service settings:
   - **Name**: `railopt-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Add Environment Variables in Render:
   - `MONGODB_URI`: `mongodb+srv://suryareddy6377_db_user:QhDRvOvyktVuAcKl@cluster0.sqfxs7u.mongodb.net/railopt?retryWrites=true&w=majority`
   - `JWT_SECRET`: `railopt_secret_jwt_key_sih2026`
   - `PORT`: `5000`
5. Click **Create Web Service**. Render will deploy your backend API at `https://railopt-backend.onrender.com`.

---

### 2. Frontend Deployment on Vercel (React Vite App)

1. Go to [Vercel Dashboard](https://vercel.com/new) and click **Import Repository**.
2. Select your repository: `thanuhh69/railopt`.
3. Configure Vercel Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variable in Vercel:
   - `VITE_API_BASE_URL`: `https://railopt-backend.onrender.com/api` (Replace with your actual Render backend URL)
5. Click **Deploy**. Vercel will build and deploy your React app live!

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React Icons, Recharts, React Router v7.
- **Backend**: Node.js, Express.js, JWT Authentication, Multer (Work Evidence Image Uploads), CSV Parser.
- **Database**: MongoDB Atlas (`mongodb+srv://...`) with In-Memory Simulation Fallback.
- **AI Decision Support**: Grok API (`grok-2-latest`) via backend proxy with strict JSON output & deterministic fallback.

---

## 👥 Login Credentials

- **Admin Portal**: `admin@railopt.demo` (Password: `admin123`)
- **User Portal**: `user@railopt.demo` (Password: `user123`)
