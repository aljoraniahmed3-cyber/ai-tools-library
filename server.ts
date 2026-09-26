/**
 * Custom Next.js server with job queue processing
 * Run this with: node -r ts-node/register server.ts
 * Or after building: npm run build && npm run start
 */

import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { setupProcessors } from './lib/jobs/queue';
import { initializeProviders } from './lib/ai/videoProviders';

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOST || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

// Create Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  // Initialize providers
  initializeProviders();

  // Setup job processors
  try {
    setupProcessors();
    console.log('✓ Job queue processors initialized');
  } catch (error) {
    console.warn('⚠ Job queue initialization warning:', error);
    console.log('Continuing without queue processing. Some features may be limited.');
  }

  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(port, (err?: Error) => {
    if (err) throw err;
    console.log(`✓ Server ready at http://${hostname}:${port}`);
    console.log(`✓ Environment: ${dev ? 'development' : 'production'}`);
    console.log(`✓ Database: ${process.env.DATABASE_URL ? 'configured' : 'not configured'}`);
    console.log(`✓ OpenAI API: ${process.env.OPENAI_API_KEY ? 'configured' : 'not configured'}`);
    console.log(`✓ Redis: ${process.env.REDIS_URL ? 'configured' : 'using localhost:6379'}`);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});
