import { Router, Request, Response, NextFunction } from 'express';
import { getAllDomains, createDomain, deleteDomain } from '../controllers/domains.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

export const domainsRouter = Router();

// Inline read cache middleware — only applied to GET (read-only)
const cacheRead = (_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
  next();
};

domainsRouter.get('/', cacheRead, getAllDomains);
domainsRouter.post('/', authMiddleware, createDomain);
domainsRouter.delete('/:id', authMiddleware, deleteDomain);
