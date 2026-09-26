# AI Tools Library - Film & Video Generation Platform

A comprehensive, production-ready web platform for creating films and videos using AI. Built with Next.js 15, TypeScript, React 19, PostgreSQL, and OpenAI integration.

## 🎯 Features

### Core Capabilities
- **AI Script Writer** - Generate stories, scripts, and dialogues with OpenAI integration
- **AI Movie Builder** - Complete workflow from project to final export
- **Scene Manager** - Organize scenes with visual prompts, camera settings, and audio
- **Character Library** - Reusable character definitions across projects
- **Video Generation** - Flexible provider system (Sora, HeyGen, Higgsfield, or custom)
- **Image & Image-to-Video** - Generate visuals with DALL-E and video providers
- **Voice & Audio** - Text-to-speech and audio generation
- **AI Editing Studio** - Professional timeline editor with FFmpeg integration
- **AI Assistant** - Natural language project creation and management
- **Cloud Storage** - S3-compatible object storage for videos and assets
- **Job Queue System** - Async processing with Bull/Redis for long-running tasks

### Technical Features
- ✅ Responsive Design (Mobile, Tablet, Desktop)
- ✅ PWA Support (Installable as App)
- ✅ Dark/Light Mode
- ✅ Arabic & English with RTL Support
- ✅ Role-Based Access Control
- ✅ API Key Management (Secure, Server-side only)
- ✅ Database Migrations
- ✅ Comprehensive Error Handling
- ✅ Rate Limiting & Security
- ✅ Detailed Logging

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL 14+
- Redis (for job queue)
- FFmpeg (for video editing)
- OpenAI API Key

## 🚀 Installation & Setup

### 1. Clone or Download the Project

```bash
git clone <repository-url>
cd ai-tools-library
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Database (Required)
DATABASE_URL=postgresql://user:password@localhost:5432/ai_tools_library

# Authentication
NEXTAUTH_SECRET=generate-a-random-secret-min-32-chars
NEXTAUTH_URL=http://localhost:3000

# OpenAI API (Required for AI features)
OPENAI_API_KEY=sk-your-api-key-here

# Optional: Video Provider APIs
VIDEO_PROVIDER_API_KEY=
VIDEO_PROVIDER_TYPE=custom

# Cloud Storage (S3-compatible)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=ai-tools-library

# Redis (for job queue)
REDIS_URL=redis://localhost:6379

# Other settings
NODE_ENV=development
LOG_LEVEL=info
```

### 4. Database Setup

Create PostgreSQL database:

```bash
createdb ai_tools_library
```

Run migrations:

```bash
npm run db:migrate
```

### 5. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000 in your browser.

## 🔑 OpenAI API Key Setup

1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add to `.env.local`:
   ```env
   OPENAI_API_KEY=sk-your-key-here
   ```
3. Restart the development server
4. The system will automatically use it for:
   - Story and script generation
   - Dialogue writing
   - Scene breakdown
   - Character descriptions
   - Visual prompt generation

**Important:** API keys are NEVER exposed to the frontend. All OpenAI calls go through the server.

## 🎨 Video Provider Configuration

The platform supports multiple video generation providers through a flexible adapter system.

### Connecting a Video Provider

1. Go to Settings → API Connections
2. Select your video provider
3. Enter API credentials
4. Click "Connect"

### Supported Providers (Ready for Integration)

- **Sora Alternative** - Text-to-video generation
- **HeyGen** - Avatar and video synthesis
- **Higgsfield** - AI video generation
- **Custom Providers** - Easily add your own

### Adding a New Provider

1. Edit `/lib/ai/videoProviders.ts`
2. Create a new provider class extending `BaseVideoProvider`
3. Implement `generateVideo()`, `getStatus()`, `cancelJob()`
4. Register with `registerProvider()`

Example:

```typescript
class MyCustomProvider extends BaseVideoProvider {
  constructor() {
    super('my-provider');
  }

  async generateVideo(options: VideoGenerationOptions): Promise<VideoGenerationResult> {
    // Implement your API integration here
  }
}

registerProvider(new MyCustomProvider());
```

## 📁 Project Structure

```
ai-tools-library/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── auth/             # Authentication endpoints
│   │   ├── projects/         # Project CRUD
│   │   ├── scripts/          # Script management
│   │   ├── characters/       # Character library
│   │   ├── scenes/           # Scene management
│   │   ├── video/            # Video generation
│   │   ├── audio/            # Audio generation
│   │   ├── timeline/         # Timeline/editing
│   │   ├── export/           # Export jobs
│   │   └── health/           # Health check
│   ├── components/           # React components
│   │   ├── providers/        # Context providers
│   │   ├── layout/           # Layout components
│   │   ├── auth/             # Auth components
│   │   └── ...
│   ├── dashboard/            # Dashboard pages
│   └── layout.tsx            # Root layout
├── lib/                      # Utilities and helpers
│   ├── db/                   # Database utilities
│   │   ├── index.ts          # Connection pool
│   │   └── schema.ts         # Database schema
│   ├── auth/                 # Authentication
│   │   ├── jwt.ts            # JWT tokens
│   │   ├── password.ts       # Password hashing
│   │   └── middleware.ts     # Auth middleware
│   ├── ai/                   # AI integrations
│   │   ├── openai.ts         # OpenAI API
│   │   ├── videoProviders.ts # Video provider system
│   │   └── ...
│   └── storage/              # Cloud storage
├── types/                    # TypeScript types
├── public/                   # Static assets
├── scripts/                  # Utility scripts
│   ├── migrate.js            # Database migration
│   └── seed.js               # Database seeding
├── styles/                   # Global styles
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
├── next.config.js            # Next.js configuration
└── package.json              # Dependencies

```

## 🔐 Security

### Key Security Features

- **API Keys on Server Only** - Never exposed to frontend or logs
- **Input Validation** - Zod schema validation on all API routes
- **Authentication** - JWT-based with secure session management
- **Authorization** - Role-based access control
- **Rate Limiting** - Protection against abuse
- **Secure File Uploads** - Size limits and type validation
- **HTTPS Headers** - Security headers on all responses
- **Password Hashing** - bcryptjs with salt rounds 12

### Security Best Practices

1. **Environment Variables**
   - Store all secrets in `.env.local`
   - Never commit secrets to git
   - Use `.env.example` for documentation

2. **API Keys**
   - Rotate keys regularly
   - Use separate keys for dev/staging/production
   - Monitor usage and set spending limits

3. **Database**
   - Use strong passwords
   - Enable SSL connections in production
   - Regular backups
   - Implement field-level encryption for sensitive data

4. **Deployment**
   - Use HTTPS only
   - Set secure cookie flags
   - Implement CSRF protection
   - Add rate limiting

## 📦 Building for Production

### 1. Build the Application

```bash
npm run build
```

### 2. Test the Build

```bash
npm start
```

### 3. Verify Deployment Checklist

- [ ] All environment variables set
- [ ] Database migrations run
- [ ] OpenAI API key configured
- [ ] NEXTAUTH_SECRET set (min 32 chars, random)
- [ ] NEXTAUTH_URL set to production domain
- [ ] Redis connection configured
- [ ] S3/Cloud storage configured
- [ ] FFmpeg installed on server
- [ ] Logs and monitoring set up
- [ ] Backup strategy in place

## 🌐 Deployment Options

### Option 1: Vercel (Recommended for Next.js)

```bash
npm i -g vercel
vercel
```

Configure in Vercel dashboard:
- Add environment variables
- Connect PostgreSQL
- Set up Redis
- Configure custom domain

### Option 2: Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t ai-tools-library .
docker run -p 3000:3000 \
  -e DATABASE_URL=postgresql://... \
  -e OPENAI_API_KEY=sk-... \
  ai-tools-library
```

### Option 3: Traditional VPS (Ubuntu/Debian)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Redis
sudo apt install -y redis-server

# Install FFmpeg
sudo apt install -y ffmpeg

# Clone repository
git clone <repo-url>
cd ai-tools-library

# Setup
npm install
npm run build

# PM2 for process management
npm i -g pm2
pm2 start npm --name "ai-tools" -- start
pm2 startup
pm2 save
```

## 📊 Database

### Schema Overview

The database includes tables for:
- **Users** - User accounts and authentication
- **Projects** - Film/video projects
- **Stories** - Story content
- **Scripts** - Screenplay content
- **Characters** - Character definitions
- **Scenes** - Individual scenes with details
- **Video Jobs** - Video generation jobs and status
- **Audio Generations** - Audio/voice generation records
- **Timelines** - Video editing timelines
- **Export Jobs** - Final export jobs
- **API Connections** - Connected external services

### Database Backup

```bash
# Backup
pg_dump ai_tools_library > backup.sql

# Restore
psql ai_tools_library < backup.sql
```

## 🔄 Job Queue System

Long-running operations use a queue system:

### Queued Operations
- Video generation
- Audio generation
- Image generation
- Video export/rendering
- FFmpeg processing
- AI text generation

### Monitor Queue Status

```typescript
// Check job status
GET /api/jobs/{jobId}

// Get all jobs for project
GET /api/projects/{projectId}/jobs
```

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Test Coverage

```bash
npm run test:coverage
```

### Integration Testing

Test the full workflow:

1. Register account
2. Create project
3. Generate story
4. Create script
5. Generate characters
6. Create scenes
7. Queue video generation
8. Monitor job status
9. Edit timeline
10. Export final video

## 📝 API Documentation

### Authentication

```bash
# Register
POST /api/auth/register
{
  "email": "user@example.com",
  "name": "User Name",
  "password": "securepassword",
  "language": "en"
}

# Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Projects

```bash
# Create project
POST /api/projects
{
  "title": "My Film",
  "description": "...",
  "genre": "Drama",
  "duration": 30,
  "language": "ar"
}

# List projects
GET /api/projects

# Get project
GET /api/projects/{projectId}

# Update project
PUT /api/projects/{projectId}

# Delete project
DELETE /api/projects/{projectId}
```

### Full API documentation available at `/api/docs` (Swagger/OpenAPI)

## 🚨 Troubleshooting

### Common Issues

**"Database connection refused"**
- Check PostgreSQL is running: `sudo systemctl status postgresql`
- Verify DATABASE_URL is correct
- Ensure database exists: `psql -l`

**"OPENAI_API_KEY not found"**
- Check `.env.local` is in project root
- Restart dev server after adding key
- Verify API key is valid

**"Redis connection failed"**
- Check Redis is running: `redis-cli ping`
- Verify REDIS_URL in `.env.local`
- Default: `redis://localhost:6379`

**"FFmpeg not found"**
- Install FFmpeg: `sudo apt install ffmpeg`
- Set FFMPEG_PATH environment variable if needed

**"File upload fails"**
- Check file size limits in `.env.local`
- Verify AWS S3 credentials if using S3
- Check disk space on server

### Debug Mode

```bash
# Increase log verbosity
LOG_LEVEL=debug npm run dev

# Check database directly
psql ai_tools_library -c "SELECT * FROM users;"

# Monitor Redis
redis-cli MONITOR
```

## 📞 Support & Documentation

- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions
- **Documentation**: See `/docs` folder for detailed guides
- **OpenAI Docs**: https://platform.openai.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/

## 📄 License

MIT License - See LICENSE file

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev)
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html)
- [OpenAI API Guide](https://platform.openai.com/docs/guides)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🎬 Example Workflow

1. **Create Account** → Register with email
2. **Create Project** → Set title, genre, duration, language
3. **Generate Story** → Use AI to create story from idea
4. **Write Script** → Generate screenplay from story
5. **Add Characters** → Create character profiles
6. **Create Scenes** → Define scenes with locations and dialogue
7. **Generate Videos** → Queue video generation for each scene
8. **Edit Timeline** → Arrange scenes, add audio, effects
9. **Add Subtitles** → Generate and sync subtitles
10. **Export** → Generate final video in MP4

## 🚀 Next Steps

After deployment:

1. Set up monitoring and error tracking
2. Configure automated backups
3. Set up CI/CD pipeline
4. Monitor API usage and costs
5. Implement analytics
6. Scale as needed

## 🤝 Contributing

Contributions are welcome! Please read CONTRIBUTING.md for details.

---

**Built with ❤️ using Next.js, React, TypeScript, and OpenAI**

**Current Version:** 1.0.0
**Last Updated:** 2026-09-26
