import express from 'express';
import compression from 'compression';
import { corsMiddleware } from './middleware/cors.middleware.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { apiRouter } from './routes/index.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();

// ── Performance middleware ────────────────────────────────────────────────
// Gzip compression: reduces JSON payload sizes by ~60-80%
app.use(compression());

// ── Security & caching base headers ──────────────────────────────────────
app.use(helmet());

// ── Core middleware ───────────────────────────────────────────────────────
app.use(corsMiddleware);
app.use(express.json());

// Mount all API routes under /api/v1
// Apply rate limiter specifically to the API routes to prevent bot spam
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/v1', apiLimiter, apiRouter);

// Global error handler
app.use(errorMiddleware);

export default app;
