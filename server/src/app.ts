import express from 'express';
import compression from 'compression';
import cors from 'cors';
import { errorMiddleware } from './middleware/error.middleware.js';
import { apiRouter } from './routes/index.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();
app.set("trust proxy", 1);

const allowedOrigins = [
  'https://vedanta-makeathon.vercel.app',
  'https://dakshinamurthy-website-v1-client.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.some((o) => origin.startsWith(o) || origin.endsWith('.vercel.app'))) {
        return callback(null, true);
      }
      return callback(null, true); // Fallback open for public API access
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);

// Explicit handler for OPTIONS preflight requests
app.options('*', cors());

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

// Fallback for unmatched API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global Error Handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;
