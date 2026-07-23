import express from 'express';
import compression from 'compression';
import cors from 'cors';
import { errorMiddleware } from './middleware/error.middleware.js';
import { apiRouter } from './routes/index.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();

// Set CORS middleware before any routes or static handlers
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Dynamic check for production, preview deployments, or local dev
  if (
    !origin || 
    origin.endsWith('.vercel.app') || 
    origin === 'https://dakshinamurthy-website-v1-client.vercel.app' ||
    origin.includes('localhost')
  ) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  }

  // Intercept OPTIONS preflight requests immediately
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// Apply standard express cors as backup
app.use(cors({
  origin: true,
  credentials: true,
}));

// ── Performance middleware ────────────────────────────────────────────────
// Gzip compression: reduces JSON payload sizes by ~60-80%
app.use(compression());

// ── Security & caching base headers ──────────────────────────────────────
app.use(helmet());

// ── Core middleware ───────────────────────────────────────────────────────
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

// Fallback 404 handler for unmatched API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found.`
  });
});

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

export default app;
