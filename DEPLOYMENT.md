# Deployment Guide

This guide covers deploying the AI Tools Library to production environments.

## Pre-Deployment Checklist

- [ ] All source code committed and tested
- [ ] Environment variables documented
- [ ] Database backups configured
- [ ] API keys generated and secured
- [ ] SSL certificates ready
- [ ] Monitoring and logging set up
- [ ] Backup and disaster recovery plan
- [ ] Performance tested under load

## Deployment Strategies

### Strategy 1: Vercel (Easiest for Next.js)

**Pros:**
- Zero-config deployment
- Auto-scaling
- Free tier available
- Built-in analytics
- Easy rollbacks

**Steps:**

1. Push code to GitHub
2. Create Vercel account
3. Import project from GitHub
4. Add environment variables in Vercel dashboard
5. Configure PostgreSQL connection (Vercel Postgres or external)
6. Set custom domain
7. Deploy

**Important:** PostgreSQL must be external since Vercel functions are stateless.

### Strategy 2: AWS (EC2 + RDS)

**Pros:**
- Full control
- Cost-effective
- Scalable
- AWS ecosystem

**Steps:**

1. Launch EC2 instance (Ubuntu 22.04 LTS)
2. Configure security groups
3. Install dependencies (Node, PostgreSQL client, FFmpeg)
4. Create RDS database
5. Clone repository
6. Configure environment variables
7. Run migrations
8. Start with PM2
9. Set up Nginx reverse proxy
10. Configure SSL with Let's Encrypt
11. Set up monitoring

**Security Group Rules:**
```
- SSH (22): Your IP
- HTTP (80): 0.0.0.0/0
- HTTPS (443): 0.0.0.0/0
- PostgreSQL (5432): VPC only
```

### Strategy 3: Docker + Kubernetes

**Pros:**
- Portable
- Easy scaling
- Orchestration
- Microservices ready

**Steps:**

1. Create Dockerfile (see README.md)
2. Create docker-compose.yml for local testing
3. Push image to Docker Hub or ECR
4. Deploy to Kubernetes cluster
5. Configure ingress
6. Set up persistent volumes for data

### Strategy 4: DigitalOcean (Balanced Approach)

**Pros:**
- Simple to use
- Affordable
- Good documentation
- App Platform available

**Steps:**

1. Create DigitalOcean account
2. Create Droplet (2GB RAM minimum)
3. Create Managed Database
4. SSH into droplet
5. Install Node, PostgreSQL client, FFmpeg
6. Clone and setup project
7. Use PM2 for process management
8. Set up Nginx reverse proxy
9. Configure SSL

## Environment Variables for Production

Create `.env.production`:

```env
# Database
DATABASE_URL=postgresql://user:password@prod-db.example.com:5432/ai_tools_library

# Auth
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=https://yourdomain.com

# OpenAI
OPENAI_API_KEY=sk-prod-key-here

# Video Providers (Only if configured)
VIDEO_PROVIDER_API_KEY=your-prod-key
VIDEO_PROVIDER_TYPE=your-provider

# Cloud Storage (Production S3)
AWS_ACCESS_KEY_ID=prod-access-key
AWS_SECRET_ACCESS_KEY=prod-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=ai-tools-prod

# Redis
REDIS_URL=redis://prod-redis.example.com:6379

# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
LOG_LEVEL=info

# Performance
NEXT_TELEMETRY_DISABLED=1

# Security
MAX_FILE_SIZE=5000000000
API_RATE_LIMIT_MAX_REQUESTS=100
```

## Database Migration in Production

```bash
# SSH into production server

# Create backup first
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Run migrations
npm run db:migrate

# Verify
psql $DATABASE_URL -c "SELECT version();"
```

## SSL/HTTPS Configuration

### Let's Encrypt with Nginx

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Create certificate
sudo certbot certonly --standalone -d yourdomain.com

# Nginx configuration
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

## Monitoring & Logging

### Application Logs

```bash
# View PM2 logs
pm2 logs ai-tools

# Save logs to file
pm2 install pm2-auto-pull
pm2 logs > /var/log/app.log
```

### Database Monitoring

```bash
# Check connections
psql -c "SELECT count(*) FROM pg_stat_activity;"

# Monitor slow queries
ALTER SYSTEM SET log_min_duration_statement = 1000;
SELECT pg_reload_conf();
```

### Server Monitoring

Use tools like:
- **Prometheus** - Metrics collection
- **Grafana** - Visualization
- **AlertManager** - Alerting
- **ELK Stack** - Logs (Elasticsearch, Logstash, Kibana)
- **Datadog** - All-in-one monitoring

## Performance Optimization

### Database
- Add indexes on frequently queried fields
- Use connection pooling
- Archive old jobs regularly
- Vacuum and analyze tables

### Application
- Enable Gzip compression
- Use CDN for static assets
- Implement caching (Redis)
- Optimize database queries

### Example Nginx Gzip Configuration

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1000;
gzip_types text/plain text/css text/xml text/javascript 
            application/x-javascript application/xml+rss 
            application/json;
```

## Backup Strategy

### Daily Automated Backups

```bash
#!/bin/bash
# backup.sh
BACKUP_DIR="/backups"
DB_NAME="ai_tools_library"
DATE=$(date +%Y%m%d_%H%M%S)

# Database backup
pg_dump $DATABASE_URL | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +30 -delete

echo "Backup completed: db_$DATE.sql.gz"
```

Add to crontab:
```bash
0 2 * * * /path/to/backup.sh
```

## Scaling

### Horizontal Scaling

1. **Load Balancer** (Nginx/HAProxy)
   - Distribute traffic across multiple app instances

2. **Database Scaling**
   - Read replicas for queries
   - Managed database services (AWS RDS)

3. **Redis Cluster**
   - Distribute cache across nodes
   - Handle high throughput

4. **CDN**
   - CloudFront, CloudFlare, or Bunny CDN
   - Cache video thumbnails, images

### Example Load Balancer Config (Nginx)

```nginx
upstream app_backend {
    server app1.internal:3000;
    server app2.internal:3000;
    server app3.internal:3000;
    keepalive 32;
}

server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://app_backend;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## Troubleshooting Deployment

### Application won't start
```bash
npm run build
npm start
# Check for build errors
```

### Database connection issues
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1;"

# Check network connectivity
nc -zv db.example.com 5432
```

### Memory issues
```bash
# Increase Node heap
export NODE_OPTIONS="--max-old-space-size=4096"
```

### High CPU usage
```bash
# Profile with Node
node --prof app.js
node --prof-process isolate-*.log > profile.txt
```

## Rollback Procedure

```bash
# In case of issues

# Rollback code
git revert <commit-hash>
npm run build
pm2 restart ai-tools

# Rollback database (if needed)
psql $DATABASE_URL < backup_latest.sql
```

## Post-Deployment

1. Test all features in production
2. Monitor logs and metrics
3. Set up alerts for errors
4. Document configuration
5. Train team on deployment process
6. Schedule regular backups
7. Plan capacity for growth

## Support

For deployment issues:
- Check application logs: `pm2 logs`
- Check system logs: `journalctl -xe`
- Verify environment variables: `env | grep -E "(DATABASE|OPENAI|AWS)"`
- Test database connection: `psql $DATABASE_URL -c "SELECT 1;"`

---

**Last Updated:** 2026-09-26
**Supported Environments:** AWS, DigitalOcean, Vercel, GCP, Azure, Self-hosted
