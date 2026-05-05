# 🚀 TaskFlow — Team Task Manager

A full-stack MERN application for managing team projects and tasks with role-based access control.

---

## 📁 Folder Structure

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### 1. Clone & Install

```bash
# Install server deps
cd server && npm install

# Install client deps
cd ../client && npm install
```

### 2. Environment Variables

**server/.env**
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/taskflow?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_min_32_chars
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**client/.env**
```env
VITE_API_URL=http://localhost:5000
```

### 3. Run Development Servers

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

## 🔐 Role Permissions

| Feature | Admin | Member |
|---------|-------|--------|
| Create/delete projects | ✅ | ❌ |
| Add/remove team members | ✅ | ❌ |
| Create/delete tasks | ✅ | ❌ |
| Assign tasks to users | ✅ | ❌ |
| Update task status | ✅ | ❌ |
| View assigned tasks | ✅ | ✅ |
| View team members | ✅ | ❌ |
| Receive notifications | ✅ | ✅ |

---

## ✨ Features

- **JWT Authentication** — secure login/signup with 7-day tokens
- **Role-Based Access Control** — Admin vs Member with protected routes (frontend + backend)
- **Project Management** — create, edit, delete projects with color coding and progress tracking
- **Task Board** — Kanban-style columns (Pending / In Progress / Completed)
- **Task Filtering** — filter by status, priority, project, search text
- **Task Priorities** — Low / Medium / High with visual indicators
- **Due Date Tracking** — overdue detection with visual warnings
- **Team Management** — admin can add/remove members per project
- **Real-time Notifications** — in-app bell with unread count, auto-refresh every 30s
- **Dashboard** — stats cards, progress bars, recent activity
- **Responsive UI** — works on desktop and tablet

---
## 🛠 Tech Stack

**Backend:** Node.js · Express · MongoDB · Mongoose · JWT · bcryptjs · express-validator

**Frontend:** React 18 · Vite · Tailwind CSS · React Router v6 · Axios · react-hot-toast · Lucide React · date-fns

**Deployment:** Railway (backend) · Vercel / Netlify (frontend) · MongoDB Atlas (database)

