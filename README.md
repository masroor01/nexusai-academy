# NexusAI Academy - Interactive Data Science & AI Learning Platform

> A production-grade, highly scalable, and secure full-stack interactive learning platform for Data Science students to master Python, Machine Learning, and Deep Learning from beginner to advanced levels.

---

## Architecture Overview

```
                               +--------------------------------------------+
                               |              React Frontend                |
                               |    Vite + Tailwind CSS + Lucide Icons     |
                               |     Zustand Store + Monaco Editor IDE      |
                               +---------------------+----------------------+
                                                     |
                                                     | HTTPS / REST APIs
                                                     v
                               +--------------------------------------------+
                               |            Express Backend (TS)            |
                               |   Helmet + Rate Limiting + Zod Validation  |
                               |          JWT & HttpOnly RBAC Auth          |
                               +------+--------------+---------------+------+
                                      |              |               |
             +------------------------+              |               +------------------------+
             v                                       v                                        v
+--------------------------+       +-------------------+       +------------------------------------+
|  Prisma ORM Database     |       |  Sandboxed Python |       | Automated Certificate Engine       |
|  PostgreSQL / SQLite     |       |  Execution Worker |       | SHA-256 Hashing + QR Code Gen      |
|  Users, Courses, Lessons |       |  Timeout & Memory |       | Public /verify/:certificateId      |
|  Progress & Credentials  |       |  AST Security San.|       |                                    |
+--------------------------+       +-------------------+       +------------------------------------+
```

---

## Tech Stack & System Components

### Frontend
- **Framework & Build:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS with dark cyber/academic aesthetic
- **Icons:** Lucide React
- **Code Editor:** `@monaco-editor/react` (VS Code engine in browser)
- **State Management:** Zustand (reactive, lightweight store)
- **Routing:** React Router v6 with Role-Based Protected Routes
- **Effects & Feedback:** `canvas-confetti` celebrations on module completion

### Backend
- **Runtime & Server:** Node.js, Express.js, TypeScript
- **Database & ORM:** Prisma ORM with SQLite (development) & PostgreSQL (production)
- **Authentication & RBAC:** JWT tokens stored in HttpOnly Cookies with Bearer header fallback; roles: `Student`, `Instructor`, `Admin`
- **Security:** Helmet.js, strict CORS configuration, Express Rate Limiters, Zod input validation schemas
- **Code Sandbox Engine:** Isolated Python 3 worker subprocess with 5-second execution timeout, memory safeguards, and AST policy checks
- **Digital Certificates:** Cryptographic SHA-256 verification hash generator, dynamic QR code renderer, and public unauthenticated verification endpoint

---

## Core Learning Paths (Beginner to Frontier AI)

1. **Level 1: Beginner Python for Data Science**
   - Core Pythonic syntax & high-performance list comprehensions
   - Vectorized matrix manipulations & feature scaling with NumPy
   - Data wrangling and exploratory analysis with Pandas

2. **Level 2: Intermediate Machine Learning Engineering**
   - Convex loss functions (MSE, Cross-Entropy) and Gradient Descent
   - Scikit-Learn pipelines, linear/logistic regression, and decision trees
   - Model evaluation matrices: ROC-AUC, Precision, Recall, and F1-Score

3. **Level 3: Advanced Deep Learning & AI**
   - Non-linear activations: Rectified Linear Units (ReLU) and numerically stable Softmax
   - Convolutional neural networks (CNNs) and backpropagation
   - Transformer fundamentals: Scaled Dot-Product Self-Attention matrix math

---

## Directory Layout

```
nexusai-academy/
├── package.json                   # Root monorepo workspace scripts
├── docker-compose.yml             # Full containerized stack (Postgres + API + Client)
├── README.md                      # Comprehensive system guide
├── server/                        # Express.js TypeScript Backend
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema models
│   │   ├── seed.ts                # Robust seeder with 3 curriculum tracks
│   │   └── dev.db                 # Local SQLite database
│   └── src/
│       ├── config/env.ts          # Environment variables validation
│       ├── controllers/           # Auth, Course, Execution, Progress, Certificate, Analytics
│       ├── middleware/            # Auth, Error, RateLimiter, Validation
│       ├── routes/                # REST endpoints
│       ├── services/              # SandboxService, CertificateService, PrismaService
│       └── server.ts              # Express server setup
└── client/                        # React Vite TypeScript Frontend
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── Dockerfile
    ├── nginx.conf
    └── src/
        ├── components/
        │   ├── common/            # Navbar, Footer, ProtectedRoute, ErrorBoundary
        │   ├── player/            # VideoPlayer with bookmarks & auto-sync
        │   ├── playground/        # Monaco CodeEditor, OutputConsole, TestResults
        │   ├── dashboard/         # StreakTracker, ProficiencyChart, StatsCard
        │   └── certificate/       # CertificateCard with QR & print
        ├── pages/                 # Home, Courses, Detail, Workspace, Dashboard, Auth, Verify
        ├── store/                 # Zustand auth, course, execution stores
        ├── services/api.ts        # Axios API client with interceptors
        ├── types/                 # Shared TypeScript models
        └── App.tsx                # Client router
```

---

## Quickstart & Local Setup

### Prerequisites
- **Node.js**: v18.x or higher (v20+ recommended)
- **Python**: 3.9+ (Python 3.14 verified)
- **Docker** *(Optional, for containerized PostgreSQL)*

### 1. Installation
Clone the repository and install all workspace dependencies:

```bash
# In the project root
npm install
```

### 2. Configure Environment Variables
Copy the `.env.example` file in `server/`:

```bash
cd server
cp .env.example .env
```

Default `.env` configuration:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET="nexusai-academy-super-secret-production-grade-key-2026"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="http://localhost:5173"
LOCAL_PYTHON_CMD="python"
```

### 3. Database Initialization & Seeding
Push the Prisma schema to create tables and execute the multi-tier seeder:

```bash
cd server
npx prisma db push
npm run seed
```

This will automatically create default accounts:
- **Student**: `student@nexusai.academy` / `Password@123`
- **Instructor**: `instructor@nexusai.academy` / `Password@123`
- **Admin**: `admin@nexusai.academy` / `Password@123`

### 4. Running the Development Servers
From the root directory, launch both the backend and frontend concurrently:

```bash
npm run dev
```

Or run them individually in separate terminal sessions:

```bash
# Terminal 1: Backend API
cd server
npm run dev

# Terminal 2: React Frontend
cd client
npm run dev
```

The application will be live at:
- **Frontend App:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000/api](http://localhost:5000/api)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## Production Deployment with Docker Compose

To spin up the entire system with PostgreSQL:

```bash
docker-compose up --build -d
```

---

## API Endpoints Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | Service health status check | No |
| `POST` | `/api/auth/register` | Register new student or instructor | No |
| `POST` | `/api/auth/login` | Login and receive HttpOnly cookie & JWT | No |
| `POST` | `/api/auth/logout` | Clear auth cookies | No |
| `GET` | `/api/auth/me` | Fetch authenticated profile & role | Yes |
| `GET` | `/api/courses` | List all available curriculum paths | Optional |
| `GET` | `/api/courses/slug/:slug` | Retrieve detailed course syllabus | Optional |
| `GET` | `/api/courses/lesson/:id` | Get lesson details, notes, & exercises | Optional |
| `POST` | `/api/execution/run` | Execute arbitrary Python in sandbox | No |
| `POST` | `/api/execution/submit` | Auto-grade solution against test cases | Yes |
| `POST` | `/api/progress/toggle` | Toggle manual lesson completion | Yes |
| `POST` | `/api/progress/note` | Save student revision notes | Yes |
| `POST` | `/api/progress/bookmark` | Bookmark timestamp in lesson video | Yes |
| `DELETE`| `/api/progress/bookmark/:id` | Remove saved video bookmark | Yes |
| `GET` | `/api/analytics` | Fetch student metrics, streaks & scores | Yes |
| `POST` | `/api/certificates/generate` | Generate certificate upon 100% pass | Yes |
| `GET` | `/api/certificates/my` | List student's earned credentials | Yes |
| `GET` | `/api/certificates/verify/:id` | Public verification lookup | No |
