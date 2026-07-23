import { Router, Request, Response, NextFunction } from 'express';
import { getAllTimeline, createTimelineStep, deleteTimelineStep } from '../controllers/timeline.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

export const timelineRouter = Router();

const cacheRead = (_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
  next();
};

timelineRouter.get('/', cacheRead, getAllTimeline);
timelineRouter.post('/', authMiddleware, createTimelineStep);
timelineRouter.delete('/:id', authMiddleware, deleteTimelineStep);
