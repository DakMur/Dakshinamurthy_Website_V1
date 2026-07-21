import express from 'express';
import compression from 'compression';
import { corsMiddleware } from './middleware/cors.middleware.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { apiRouter } from './routes/index.js';

const app = express();

// ── Performance middleware ────────────────────────────────────────────────
// Gzip compression: reduces JSON payload sizes by ~60-80%
app.use(compression());

// ── Security & caching base headers ──────────────────────────────────────
app.use((_req, res, next) => {
  // Prevent MIME-sniffing attacks
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  // Ensure CDNs cache separate compressed/plain variants
  res.setHeader('Vary', 'Accept-Encoding');
  next();
});

// ── Core middleware ───────────────────────────────────────────────────────
app.use(corsMiddleware);
app.use(express.json());

// Mount all API routes under /api/v1
app.use('/api/v1', apiRouter);

// Global error handler
app.use(errorMiddleware);

export default app;
