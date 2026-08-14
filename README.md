<div align="center">
  <img src="docs/assets/banner.png" alt="Ariadne Banner" width="75%" />

**A modern, full-stack collaborative project management platform built for speed, scalability, and developer experience.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

  <p align="center">
    <a href="#-key-features">Key Features</a> •
    <a href="#-system-architecture">Architecture</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-api-documentation">API Docs</a> •
    <a href="#-testing-strategy">Testing</a> •
  </p>
</div>

---

## 📸 Preview

<div align="center">
  <img src="docs/assets/dashboard-preview.png" alt="Ariadne Dashboard Preview" width="85%" />
  <p><em>Interactive project board and real-time dashboard view</em></p>
</div>

---

## ✨ Key Features

- 🎯 **Project & Task Management**: Granular task orchestration with priorities (`LOW`, `MEDIUM`, `HIGH`, `URGENT`), statuses (`TODO`, `IN_PROGRESS`, `DONE`), estimation tracking, and assignees.
- 🔐 **Robust Authentication & RBAC**: JWT-based session security, bcrypt password hashing, and strict role/membership access controls on workspaces.
- ⚡ **URL-Driven Search & Filters**: Fully bookmarkable and shareable views without unnecessary page reloads.
- 📊 **Aggregated Dashboard**: Global workspace analytics, recent activities, task distribution, and upcoming deadlines.
- 🛠️ **Developer Experience & Type Safety**: End-to-end type validation from frontend Zod schemas to backend DTOs (`class-validator`) and Prisma database entities.
- 🧪 **High Test Coverage**: Unit-tested frontend components (Vitest) and enterprise-grade backend services (Jest + NestJS testing modules).

---

## 🏗️ System Architecture

```text
ariadne/
├── frontend/                 # Next.js App Router & Server/Client Components
│   ├── src/
│   │   ├── app/              # Application routes & layouts
│   │   ├── components/       # UI atomic design components & Shadcn/Tailwind
│   │   ├── hooks/            # Custom React hooks (state & URL sync)
│   │   ├── lib/              # Utilities, API client & Zod schemas
│   │   └── types/            # Frontend TypeScript definitions
│   └── vitest.config.ts      # Vitest configuration & RTL suite
│
├── backend/                  # NestJS RESTful API & Domain Architecture
│   ├── src/
│   │   ├── auth/             # JWT Strategy, guards & decorators
│   │   ├── projects/         # Projects module, DTOs & controllers
│   │   ├── tasks/            # Tasks service, entity mapping & CRUD logic
│   │   ├── users/            # User management & profile handlers
│   │   ├── dashboard/        # Metrics aggregation & workspace queries
│   │   └── prisma/           # Database service client & schema definition
│   └── tsconfig.json         # Strict NodeNext TypeScript configuration
│
└── docker-compose.yml        # Multi-container orchestration (DB, API, Client)
```

---

## 💻 Tech Stack

### Frontend

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19 / 18)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Testing**: [Vitest](https://vitest.dev/) + React Testing Library

### Backend

- **Framework**: [NestJS](https://nestjs.com/) (Modular Architecture)
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) + [Prisma ORM](https://www.prisma.io/)
- **Validation & Docs**: `class-validator`, `class-transformer`, OpenAPI / Swagger
- **Authentication**: Passport.js + JWT
- **Testing**: [Jest](https://jestjs.io/) + `@nestjs/testing`

### DevOps & Tooling

- **Containerization**: Docker & Docker Compose
- **Linting & Formatting**: ESLint + Prettier
- **CI/CD**: GitHub Actions

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- [Docker & Docker Compose](https://www.docker.com/) (for containerized setup)

---

### Option A: Running with Docker (Recommended)

1. **Clone the repository:**

```bash
git clone git clone https://github.com/your-username/ariadne.git
cd ariadne
```

2. **Launch the entire stack:**

```bash
docker compose up --build
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:4000/api`
- Swagger Documentation: `http://localhost:4000/api/docs`

---

### Option B: Local Manual Setup

#### 1. Configure Environment Variables

**Backend (`backend/.env`):**

```env
PORT=4000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ariadne?schema=public"
JWT_SECRET="your_secure_jwt_secret_key"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="http://localhost:3000"
```

**Frontend (`frontend/.env.local`):**

```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
```

#### 2. Start Backend

```bash
cd backend
npm install
npx prisma migrate dev
npm run start:dev
```

#### 3. Start Frontend

```bash
cd ../frontend
npm install
npm run dev
```

---

## 📖 API Documentation

<div align="center">
  <img src="docs/assets/swagger-preview.png" alt="Ariadne Swagger Preview" width="85%" />
  <p><em>The backend includes interactive OpenAPI (Swagger) documentation.</em></p>
</div>

Once the server is running, navigate to:

```text
http://localhost:4000/api/docs

```

---

## 🧪 Testing Strategy

Quality and reliability are enforced across both stacks with automated testing pipelines:

```bash
# Frontend Unit & Integration Tests (Vitest)
cd frontend
npm run test

# Backend Unit Tests (Jest)
cd backend
npm run test

# Backend Test Coverage
npm run test:cov

```

---

## 📄 License

This project is licensed under the [MIT License](https://www.google.com/search?q=LICENSE).
