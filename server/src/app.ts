import express from 'express';
import compression from 'compression';
import cors from 'cors';
import { errorMiddleware } from './middleware/error.middleware.js';
import { apiRouter } from './routes/index.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();

// ── CORS Configuration at the VERY TOP ──────────────────────────────────
const allowedOrigins = [
  'https://dakshinamurthy-website-v1-client.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean) as string[];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) return callback(null, true);
    
    // Allow exact matches OR any vercel preview deployment ending in .vercel.app
    if (
      allowedOrigins.includes(origin) || 
      origin.endsWith('.vercel.app') || 
      process.env.CLIENT_URL === '*'
    ) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

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

// 404 Handler to ensure preflights don't fail silently
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

// Global error handler
app.use(errorMiddleware);

export default app;
