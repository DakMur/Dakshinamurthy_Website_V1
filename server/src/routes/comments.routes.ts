import { Router } from 'express';
import { getAllComments, deleteComment } from '../controllers/comments.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

export const commentsRouter = Router();

commentsRouter.get('/', getAllComments);
commentsRouter.delete('/:id', authMiddleware, deleteComment);
