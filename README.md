# RAILOPT — Automatic Railway Maintenance Block Planning System

**Smart India Hackathon (SIH) Prototype Simulation**

RAILOPT is an intelligent railway maintenance block planning prototype designed to coordinate maintenance tasks across Engineering, Traction Distribution (TRD), and Signal & Telecommunication (S&T) departments alongside corridor availability windows and train timetables.

---

## 📌 Problem Statement

Railway maintenance for fixed infrastructure (Engineering, TRD, S&T) is traditionally planned independently. Departments submit separate block and disconnection demands, leading to:
- Repeated corridor blockades and unnecessary asset downtime.
- Uncoordinated maintenance tasks occupying track lines at different hours of the day.
- Conflicts between maintenance disconnections and scheduled train passages.
- Reduced overall line capacity and train operational efficiency.

---

## 🚀 Solution & Core Features

RAILOPT unifies maintenance planning into a single automated pipeline:

1. **Data Integration**: Integrates simulated legacy data sources:
   - **TMS** (Track Management System — Engineering tasks)
   - **SMMS** (Signalling Maintenance & Management System — S&T tasks)
   - **TDMS** (Traction Distribution Management System — OHE tasks)
   - **COA** (Control Office Application — Corridor availability & train timetables)
   - **BDMS** (Block Demand Management System — Department block requests)
2. **AI & Priority Analysis**: Combines Grok AI structured analysis with a deterministic fallback scoring formula based on criticality, urgency, asset impact, train impact, safety impact, and overdue status.
3. **Conflict Detection**: Scans scheduled train passages, corridor windows, and block requests to identify train movement overlaps, corridor availability breaches, and department collisions.
4. **Block Optimization & Multi-Department Grouping**: Groups compatible tasks across Engineering, S&T, and Traction into unified maintenance blocks during free windows between train passes.
5. **Interactive Schedule Portals**:
   - **Admin Portal**: Executive dashboard, data integration, task register, optimization engine, conflict resolution, weekly/monthly plans, analytics, and CSV exports.
   - **User Portal**: Simplified field staff view for assigned tasks and section statuses.
6. **Demo Scenario Trigger**: Includes a dedicated **"RUN DEMO SCENARIO"** feature demonstrating automatic resolution of train conflicts on the VJA-GNT corridor (15 Sep 2026).

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React Icons, Recharts, React Router v7.
- **Backend**: Node.js, Express.js, Multer (CSV upload), CSV Parser.
- **Database**: MongoDB & Mongoose ORM.
- **AI Decision Support**: Grok API (`grok-2-latest`) via backend proxy with strict JSON output & deterministic fallback.

---

## 🔐 Environment Variables (`.env`)

Create a `.env` file in the project root:

```env
MONGODB_URI=mongodb://localhost:27017/railopt
GROK_API_KEY=your_grok_api_key_here
GROK_MODEL=grok-2-latest
PORT=5000
CLIENT_URL=http://localhost:5173
```

---

## ⚡ Quick Start & Installation

### 1. Seed Database (500+ Maintenance Tasks, 50+ Corridors, 500+ Train Timetables)
```bash
cd backend
npm run seed
```

### 2. Start Backend Server
```bash
cd backend
npm run dev
```

### 3. Start Frontend Development Server
```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 👥 Login Credentials

- **Admin Portal**: `admin@railopt.demo`
- **User Portal**: `user@railopt.demo`

---

## 📑 Project Limitations & Prototype Scope

- **Prototype Simulation**: This software uses synthetic datasets stored in MongoDB. It is **NOT** connected to live production Indian Railways systems (TMS, SMMS, TDMS, COA, BDMS).
- **Production Deployment Requirements**: Enterprise deployment requires official CRIS/FOIS integration, security accreditation, domain safety validation, cybersecurity boundary controls, and operational approval.
