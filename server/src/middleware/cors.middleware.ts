import cors from 'cors';

export const corsMiddleware = cors({
  origin: process.env.CLIENT_URL || [
    'https://vedanta-makeathon.vercel.app',
    'https://dakshinamurthy-website-v1-client.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5000'
  ],
  credentials: true,
});
