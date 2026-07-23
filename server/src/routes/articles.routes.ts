import { Router, Request, Response, NextFunction } from 'express';
import { getAllArticles, createArticle, deleteArticle, likeArticle, viewArticle, addCommentToArticle } from '../controllers/articles.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

export const articlesRouter = Router();

// Inline read cache middleware — only applied to GET (read-only)
const cacheRead = (_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
  next();
};

articlesRouter.get('/', cacheRead, getAllArticles);
articlesRouter.post('/', authMiddleware, createArticle);
articlesRouter.delete('/:id', authMiddleware, deleteArticle);
articlesRouter.post('/:id/like', likeArticle);
articlesRouter.post('/:id/view', viewArticle);
articlesRouter.post('/:id/comments', addCommentToArticle);
