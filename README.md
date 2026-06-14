# ⚡ TaskFlow — MERN Task Management Application

A production-ready, full-stack task management app built with the MERN stack. Features JWT authentication, full CRUD operations, smart filtering, and a modern responsive UI.

---

## 📁 Project Structure

```
taskflow/
├── package.json                  ← Root scripts (concurrently)
│
├── backend/
│   ├── package.json
│   ├── server.js                 ← Entry point
│   ├── app.js                    ← Express app setup
│   ├── .env                      ← Environment variables (local)
│   ├── .env.example
│   ├── render.yaml               ← Render deployment config
│   ├── config/
│   │   └── db.js                 ← MongoDB connection
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── auth.js               ← JWT protect middleware
│   │   ├── validate.js           ← express-validator rules
│   │   └── errorHandler.js
│   └── routes/
│       ├── auth.js
│       └── tasks.js
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    ├── vercel.json               ← Vercel deployment config
    ├── .env
    ├── .env.example
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── context/
        │   ├── AuthContext.jsx
        │   └── TaskContext.jsx
        ├── services/
        │   ├── api.js            ← Axios instance
        │   ├── authService.js
        │   └── taskService.js
        ├── hooks/
        │   └── useDebounce.js
        ├── utils/
        │   └── helpers.js
        ├── pages/
        │   ├── Dashboard.jsx
        │   ├── Tasks.jsx
        │   └── NotFound.jsx
        └── components/
            ├── auth/
            │   ├── Login.jsx
            │   └── Register.jsx
            ├── layout/
            │   ├── Navbar.jsx
            │   └── ProtectedRoute.jsx
            ├── tasks/
            │   ├── TaskCard.jsx
            │   ├── TaskForm.jsx
            │   ├── TaskFilters.jsx
            │   └── StatCard.jsx
            └── ui/
                ├── Modal.jsx
                ├── ConfirmDialog.jsx
                ├── EmptyState.jsx
                └── Spinner.jsx
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- **Node.js** v18+ ([nodejs.org](https://nodejs.org))
- **MongoDB** — either:
  - Local: [Install MongoDB Community](https://www.mongodb.com/try/download/community)
  - Cloud: [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier)
- **npm** v9+

---

### Step 1 — Clone & Install

```bash
# Clone the repository
git clone <your-repo-url> taskflow
cd taskflow

# Install all dependencies (root + backend + frontend)
npm run install:all
```

Or install individually:

```bash
# Root
npm install

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

---

### Step 2 — Configure Environment Variables

**Backend** — edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/taskflow
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=30d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

> For MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string.

**Frontend** — edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

### Step 3 — Start MongoDB (Local)

```bash
# macOS / Linux
mongod --dbpath /usr/local/var/mongodb

# Or with Homebrew services
brew services start mongodb-community

# Windows (run as Administrator)
net start MongoDB
```

---

### Step 4 — Run the Application

```bash
# From root directory — starts both backend and frontend
npm run dev
```

Or separately:

```bash
# Terminal 1 — Backend (port 5000)
npm run dev:backend

# Terminal 2 — Frontend (port 5173)
npm run dev:frontend
```

**Open:** [http://localhost:5173](http://localhost:5173)

---

## 🗄️ MongoDB Atlas Setup (Cloud)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) → Create free account
2. Create a new **free cluster** (M0)
3. Under **Database Access** → Add a user with read/write access
4. Under **Network Access** → Add IP: `0.0.0.0/0` (allow all) or your specific IP
5. Click **Connect** → **Connect your application**
6. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/taskflow?retryWrites=true&w=majority
   ```
7. Paste it into `backend/.env` as `MONGODB_URI`

---

## 🌐 API Reference

### Auth Endpoints

| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login & get JWT | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Task Endpoints

| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| GET | `/api/tasks` | Get all tasks (with filters) | Yes |
| POST | `/api/tasks` | Create new task | Yes |
| GET | `/api/tasks/:id` | Get single task | Yes |
| PUT | `/api/tasks/:id` | Update task | Yes |
| DELETE | `/api/tasks/:id` | Delete task | Yes |
| PATCH | `/api/tasks/:id/toggle` | Toggle complete/pending | Yes |

#### GET `/api/tasks` — Query Parameters

| Param | Values | Description |
|-------|--------|-------------|
| `search` | string | Search by title (case-insensitive) |
| `status` | `all`, `pending`, `completed` | Filter by status |
| `priority` | `all`, `low`, `medium`, `high` | Filter by priority |
| `sort` | `newest`, `oldest`, `dueDate`, `priority` | Sort order |
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 50) |

---

## ☁️ Production Deployment

### Backend → Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add Environment Variables:
   ```
   NODE_ENV=production
   MONGODB_URI=<your Atlas connection string>
   JWT_SECRET=<strong random string>
   JWT_EXPIRE=30d
   CLIENT_URL=https://your-frontend.vercel.app
   ```
6. Click **Create Web Service**
7. Note your Render URL: `https://taskflow-api.onrender.com`

---

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repository
3. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add Environment Variable:
   ```
   VITE_API_URL=https://your-render-backend.onrender.com/api
   ```
5. Click **Deploy**

---

### Post-Deployment Checklist

- [ ] Backend health check: `GET https://your-api.onrender.com/api/health`
- [ ] Update backend `CLIENT_URL` to your Vercel URL
- [ ] Update frontend `VITE_API_URL` to your Render URL
- [ ] Test registration and login
- [ ] Test CRUD operations
- [ ] Verify JWT auth on protected routes

---

## 🔧 Features

- ✅ JWT Authentication (register, login, logout)
- ✅ Password hashing with bcryptjs (salt rounds: 12)
- ✅ Protected routes (frontend + backend)
- ✅ Create, Read, Update, Delete tasks
- ✅ Toggle task status (pending ↔ completed)
- ✅ Task priority (Low / Medium / High)
- ✅ Task due dates with overdue detection
- ✅ Search tasks by title (debounced)
- ✅ Filter by status and priority
- ✅ Sort by date or priority
- ✅ Dashboard with stats and completion rate
- ✅ Toast notifications (react-hot-toast)
- ✅ Loading indicators throughout
- ✅ Confirm dialogs for destructive actions
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ MVC architecture on backend
- ✅ express-validator for input validation
- ✅ Global error handling middleware
- ✅ MongoDB indexes for performance

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| State | React Context API |
| HTTP | Axios |
| Icons | React Icons |
| Toasts | React Hot Toast |
| Router | React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT (jsonwebtoken) |
| Hashing | bcryptjs |
| Validation | express-validator |
| Dev Tools | nodemon, concurrently |
| Deploy FE | Vercel |
| Deploy BE | Render |

---

## 📜 License

MIT — free to use and modify.
