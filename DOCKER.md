# Docker Setup & Deployment

This guide covers running AI Tools Library with Docker.

## Quick Start with Docker Compose

### Prerequisites
- Docker and Docker Compose installed
- Environment variables configured (see below)

### Local Development with Docker

```bash
# Clone and enter directory
cd ai-tools-library

# Create .env.local with your configuration
cp .env.example .env.local

# Edit .env.local and add your API keys
nano .env.local

# Start all services (PostgreSQL, Redis, App)
docker-compose up -d

# Run database migrations
docker-compose exec app npm run db:migrate

# View logs
docker-compose logs -f app

# Stop all services
docker-compose down
```

The application will be available at `http://localhost:3000`

### Environment Variables for Docker

Create a `.env.local` file in the root directory:

```env
# Database
DB_USER=aitools
DB_PASSWORD=your-secure-password
DB_NAME=ai_tools_library
DATABASE_URL=postgresql://aitools:your-secure-password@postgres:5432/ai_tools_library

# Authentication
NEXTAUTH_SECRET=your-random-32-char-secret
NEXTAUTH_URL=http://localhost:3000

# OpenAI API (Optional - only if you have this)
# OPENAI_API_KEY=sk-your-api-key

# AWS S3 (Optional)
# AWS_ACCESS_KEY_ID=your-key
# AWS_SECRET_ACCESS_KEY=your-secret
# AWS_REGION=us-east-1
# AWS_S3_BUCKET=ai-tools-bucket

# Redis (Docker Compose handles this)
REDIS_URL=redis://redis:6379

# Environment
NODE_ENV=development
```

## Building Docker Image

### Build locally

```bash
docker build -t ai-tools-library:latest .
```

### Run built image

```bash
docker run -d \
  --name ai-tools-app \
  -p 3000:3000 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/db \
  -e REDIS_URL=redis://redis:6379 \
  -e NEXTAUTH_SECRET=your-secret \
  -e OPENAI_API_KEY=sk-your-key \
  ai-tools-library:latest
```

## Docker Compose Services

The `docker-compose.yml` provides:

1. **PostgreSQL** - Database on port 5432
2. **Redis** - Job queue on port 6379
3. **Application** - Next.js app on port 3000

### Service Commands

```bash
# View all services
docker-compose ps

# View database logs
docker-compose logs postgres

# View Redis logs
docker-compose logs redis

# Access PostgreSQL CLI
docker-compose exec postgres psql -U aitools -d ai_tools_library

# Access application shell
docker-compose exec app sh

# Rebuild images
docker-compose build --no-cache

# Restart a service
docker-compose restart app
```

## Production Deployment

### Using Docker Swarm

```bash
# Initialize swarm
docker swarm init

# Create production .env file
cat > .env.prod << EOF
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@db.example.com:5432/ai_tools_library
REDIS_URL=redis://redis.example.com:6379
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=https://yourdomain.com
OPENAI_API_KEY=sk-your-key
EOF

# Deploy stack
docker stack deploy -c docker-compose.yml ai-tools
```

### Using Kubernetes

Create `k8s/deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-tools-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ai-tools-app
  template:
    metadata:
      labels:
        app: ai-tools-app
    spec:
      containers:
      - name: app
        image: ai-tools-library:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: ai-tools-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: ai-tools-secrets
              key: redis-url
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: ai-tools-secrets
              key: openai-api-key
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: ai-tools-service
spec:
  selector:
    app: ai-tools-app
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

Deploy to Kubernetes:

```bash
# Create secrets
kubectl create secret generic ai-tools-secrets \
  --from-literal=database-url=$DATABASE_URL \
  --from-literal=redis-url=$REDIS_URL \
  --from-literal=openai-api-key=$OPENAI_API_KEY

# Deploy
kubectl apply -f k8s/deployment.yaml

# View deployment status
kubectl get deployments
kubectl get pods
kubectl get services
```

## Docker Registry (DockerHub / ECR)

### Push to DockerHub

```bash
# Login
docker login

# Tag image
docker tag ai-tools-library:latest yourusername/ai-tools-library:latest

# Push
docker push yourusername/ai-tools-library:latest

# Pull on another machine
docker pull yourusername/ai-tools-library:latest
```

### Push to AWS ECR

```bash
# Get login token
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

# Tag image
docker tag ai-tools-library:latest \
  123456789.dkr.ecr.us-east-1.amazonaws.com/ai-tools-library:latest

# Push
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/ai-tools-library:latest
```

## Troubleshooting

### Database connection fails

```bash
# Check PostgreSQL is running
docker-compose logs postgres

# Verify connection string
docker-compose exec app psql $DATABASE_URL -c "SELECT 1;"
```

### Redis connection fails

```bash
# Check Redis is running
docker-compose logs redis

# Test Redis connection
docker-compose exec redis redis-cli ping
```

### Port already in use

```bash
# Change ports in docker-compose.yml
# Or kill existing process
lsof -i :3000
kill -9 <PID>
```

### Out of memory

```bash
# Check Docker resources
docker stats

# Increase Docker memory limit
# In Docker Desktop: Settings → Resources → Memory
```

### Application won't start

```bash
# View detailed logs
docker-compose logs -f app

# Rebuild image
docker-compose build --no-cache

# Check environment variables
docker-compose config
```

## Monitoring & Logging

### View real-time logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app

# Last 100 lines
docker-compose logs --tail=100 app

# With timestamps
docker-compose logs -f --timestamps app
```

### Persistent logging

Mount log volume:

```yaml
services:
  app:
    volumes:
      - ./logs:/app/logs
```

## Backing up Docker Data

```bash
# Backup PostgreSQL
docker-compose exec postgres pg_dump -U aitools ai_tools_library > backup.sql

# Backup volumes
docker run --rm \
  -v ai-tools-library_postgres_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/postgres_backup.tar.gz -C /data .

# Restore
docker run --rm \
  -v ai-tools-library_postgres_data:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/postgres_backup.tar.gz -C /data
```

## Performance Optimization

### Multi-stage builds
The Dockerfile uses multi-stage builds to reduce image size (~400MB → ~200MB).

### Layer caching
Optimize layer caching:

```dockerfile
COPY package*.json ./
RUN npm ci
COPY . .
```

### Resource limits
Set limits in docker-compose.yml:

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

## Health Checks

The Docker image includes a built-in health check:

```bash
# Check health status
docker ps

# View health status in detail
docker inspect --format='{{.State.Health}}' <container-id>
```

---

**For production deployments, use proper orchestration (Kubernetes, Docker Swarm) and managed services (AWS RDS, AWS ElastiCache).**
