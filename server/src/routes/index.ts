import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { domainsRouter } from './domains.routes.js';
import { articlesRouter } from './articles.routes.js';
import { commentsRouter } from './comments.routes.js';
import { timelineRouter } from './timeline.routes.js';
import { quotesRouter } from './quotes.routes.js';
import { analyticsRouter } from './analytics.routes.js';
import { geminiRouter } from './gemini.routes.js';
import { registrationRouter } from './registration.routes.js';
import { noticesRouter } from './notices.routes.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/domains', domainsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/timeline', timelineRouter);
apiRouter.use('/quotes', quotesRouter);
apiRouter.use('/analytics', analyticsRouter);
apiRouter.use('/gemini', geminiRouter);
apiRouter.use('/registration', registrationRouter);
apiRouter.use('/notices', noticesRouter);

