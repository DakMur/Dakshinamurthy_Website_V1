import { Router } from 'express';
import {
  getPublishedNoticesHandler,
  getAllNoticesHandler,
  createNoticeHandler,
  updateNoticeHandler,
  deleteNoticeHandler
} from '../controllers/notices.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

export const noticesRouter = Router();

// Public — fetch published notices for the Notice Board page
noticesRouter.get('/', getPublishedNoticesHandler);

// Admin — fetch all notices (including unpublished) for admin panel
noticesRouter.get('/all', authMiddleware, getAllNoticesHandler);

// Admin — CRUD operations
noticesRouter.post('/', authMiddleware, createNoticeHandler);
noticesRouter.put('/:id', authMiddleware, updateNoticeHandler);
noticesRouter.delete('/:id', authMiddleware, deleteNoticeHandler);
