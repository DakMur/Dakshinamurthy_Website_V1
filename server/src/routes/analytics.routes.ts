import { Router } from 'express';
import { getAnalytics, trackPageView } from '../controllers/analytics.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

export const analyticsRouter = Router();

analyticsRouter.get('/', authMiddleware, getAnalytics);
analyticsRouter.post('/track', trackPageView);
