import { Router, Request, Response, NextFunction } from 'express';
import { getAllQuotes, createQuote, deleteQuote } from '../controllers/quotes.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

export const quotesRouter = Router();

const cacheRead = (_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
  next();
};

quotesRouter.get('/', cacheRead, getAllQuotes);
quotesRouter.post('/', authMiddleware, createQuote);
quotesRouter.delete('/:id', authMiddleware, deleteQuote);
