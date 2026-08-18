import { Router, Request, Response, NextFunction } from 'express';
import {
  getTimelineHandler,
  getAdminTimelineHandler,
  createTimelineHandler,
  reorderTimelineHandler,
  updateTimelineHandler,
  deleteTimelineHandler,
} from '../controllers/timeline.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

export const timelineRouter = Router();

// Cache headers for the public read route only
const cacheRead = (_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
  next();
};

// ── PUBLIC ──────────────────────────────────────────────────────────────────
timelineRouter.get('/', cacheRead, getTimelineHandler);

// ── ADMIN PROTECTED ─────────────────────────────────────────────────────────
// NOTE: /admin and /reorder must be registered BEFORE /:id to avoid route collision
timelineRouter.get('/admin', authMiddleware, getAdminTimelineHandler);
timelineRouter.put('/reorder', authMiddleware, reorderTimelineHandler);
timelineRouter.post('/', authMiddleware, createTimelineHandler);
timelineRouter.put('/:id', authMiddleware, updateTimelineHandler);
timelineRouter.delete('/:id', authMiddleware, deleteTimelineHandler);
