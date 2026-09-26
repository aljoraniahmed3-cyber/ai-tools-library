# AI Tools Library - Quick Start Guide

Get up and running in 5 minutes!

## Option 1: Local Development (Recommended for Learning)

### Step 1: Prerequisites
- Node.js 18+ https://nodejs.org
- PostgreSQL 14+ https://www.postgresql.org/download/
- Redis https://redis.io/download/
- FFmpeg https://ffmpeg.org/download.html

### Step 2: Setup

```bash
# Clone project
cd ai-tools-library

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Step 3: Configure

Edit `.env.local`:

```env
# Database (create this database first)
DATABASE_URL=postgresql://username:password@localhost:5432/ai_tools_library

# Auth
NEXTAUTH_SECRET=generate-with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

# Optional: OpenAI (for AI features)
# OPENAI_API_KEY=sk-your-key-here

# Redis
REDIS_URL=redis://localhost:6379
```

### Step 4: Database

```bash
# Create PostgreSQL database
createdb ai_tools_library

# Run migrations
npm run db:migrate
```

### Step 5: Start

```bash
npm run dev
```

Open http://localhost:3000 ✅

---

## Option 2: Docker (Recommended for Deployment)

### Prerequisites
- Docker https://www.docker.com/products/docker-desktop
- Docker Compose (included with Docker Desktop)

### Setup

```bash
# Create .env.local
cp .env.example .env.local

# Edit with your settings
nano .env.local

# Start all services
docker-compose up -d

# Run migrations
docker-compose exec app npm run db:migrate

# View logs
docker-compose logs -f app
```

Open http://localhost:3000 ✅

Stop services:
```bash
docker-compose down
```

---

## Option 3: Cloud Deployment (Vercel)

### Step 1: Prepare

```bash
git init
git add .
git commit -m "Initial commit"
```

### Step 2: Deploy

```bash
npm i -g vercel
vercel
```

### Step 3: Configure in Vercel Dashboard

- Add Environment Variables (same as .env.local)
- Connect PostgreSQL (Vercel Postgres or external)
- Connect Redis (Upstash or external)
- Domain settings

---

## First Steps After Setup

### 1. Create Account

Go to http://localhost:3000
- Click "Register"
- Create test account

### 2. Test API

```bash
# Get auth token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your@email.com",
    "password": "yourpassword"
  }'

# Check health
curl http://localhost:3000/api/health
```

### 3. Create First Project

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Film",
    "genre": "Drama",
    "duration": 30,
    "language": "en"
  }'
```

### 4. Generate Story (with OpenAI)

```bash
curl -X POST http://localhost:3000/api/projects/{projectId}/story/generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "idea": "A story about...",
    "genre": "Drama"
  }'
```

---

## Project Structure

```
ai-tools-library/
├── app/                    # Next.js app router
│   ├── api/               # API endpoints
│   ├── components/        # React components
│   ├── dashboard/         # Dashboard pages
│   ├── auth/              # Auth pages
│   └── page.tsx           # Landing page
├── lib/                   # Utilities
│   ├── db/               # Database
│   ├── auth/             # Authentication
│   ├── ai/               # AI integrations
│   └── jobs/             # Job queue
├── types/                # TypeScript types
├── public/               # Static files
└── .env.local           # Environment variables (not in git!)
```

---

## Common Tasks

### Add API Key

1. Get key from service provider
2. Add to `.env.local`
3. Restart dev server: `npm run dev`

### View Database

```bash
# Using psql
psql ai_tools_library

# Common queries
SELECT * FROM projects;
SELECT * FROM users;
```

### Check Job Queue Status

```bash
# Start Redis CLI
redis-cli

# View queue jobs
LLEN bull:video-generation:wait
```

### View Logs

```bash
# Application logs
npm run dev

# Database logs (if using Docker)
docker-compose logs -f postgres

# Redis logs (if using Docker)
docker-compose logs -f redis
```

---

## Troubleshooting

### "Database connection refused"
```bash
# Check PostgreSQL is running
psql -l

# Or create database
createdb ai_tools_library
```

### "Redis connection failed"
```bash
# Check Redis is running
redis-cli ping
# Should return: PONG
```

### "OPENAI_API_KEY not found"
- Don't have a key? Skip AI features for now
- Add to `.env.local` and restart dev server
- System will show "Not Connected" in Settings

### "Port 3000 already in use"
```bash
# Find and kill process
lsof -i :3000
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### "Module not found"
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

---

## Development Workflow

### Make changes to code

```bash
# Files auto-reload in development
# Just save and refresh browser
```

### Add new page

Create file: `app/dashboard/new-page/page.tsx`

```typescript
'use client';
import { DashboardLayout } from '@/app/components/layout/DashboardLayout';

export default function NewPage() {
  return (
    <DashboardLayout title="My New Page">
      <div>Content here</div>
    </DashboardLayout>
  );
}
```

### Add new API endpoint

Create file: `app/api/new-endpoint/route.ts`

```typescript
import { NextRequest } from 'next/server';
import { authenticateRequest, createSuccessResponse, createErrorResponse } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  const { user, error } = await authenticateRequest(request);
  
  if (error || !user) {
    return createErrorResponse('Unauthorized', 401);
  }
  
  return createSuccessResponse({ message: 'Hello!' });
}
```

---

## Next Steps

1. ✅ Setup complete
2. 🔑 Add API keys (optional)
3. 🎬 Create test project
4. 📝 Generate story with AI
5. 📤 Queue video generation
6. ✂️ Edit timeline
7. 📤 Export final video
8. 🚀 Deploy to production

---

## Useful Commands

```bash
# Development
npm run dev              # Start dev server

# Building
npm run build           # Build for production
npm run lint            # Check code quality

# Database
npm run db:migrate      # Run migrations
npm run db:seed         # Populate test data

# Production
npm start               # Run production build
```

---

## Documentation

- **Setup**: See README.md
- **Deployment**: See DEPLOYMENT.md
- **Docker**: See DOCKER.md
- **API**: See PROJECT_SUMMARY.md
- **Security**: See README.md (Security section)

---

## Getting Help

1. Check the FAQ in README.md
2. Review error logs in terminal
3. Check database: `psql ai_tools_library`
4. Check API: `curl http://localhost:3000/api/health`
5. Review code in `app/` and `lib/` directories

---

**🎉 Welcome to AI Tools Library!**

Start building amazing films and videos with AI today!
