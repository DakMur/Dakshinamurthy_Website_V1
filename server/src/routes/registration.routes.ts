import { Router } from 'express';
import {
  checkDuplicatesHandler,
  signupHandler,
  loginHandler,
  getConfigHandler,
  updateConfigHandler,
  updateTeamHandler,
  uploadDocumentHandler,
  getAllTeamsHandler,
  updateTeamPromotionHandler,
  updateDemoVideoHandler
} from '../controllers/registration.controller.js';
import { streamUploader } from '../middleware/streamUploader.middleware.js';

export const registrationRouter = Router();

registrationRouter.post('/check-duplicates', checkDuplicatesHandler);
registrationRouter.post('/signup', signupHandler);
registrationRouter.post('/login', loginHandler);
registrationRouter.get('/config', getConfigHandler);
registrationRouter.post('/config', updateConfigHandler);
registrationRouter.put('/team/:teamId', updateTeamHandler);
registrationRouter.post('/upload', streamUploader, uploadDocumentHandler);
registrationRouter.get('/teams', getAllTeamsHandler);
registrationRouter.patch('/team/:teamId/promotion', updateTeamPromotionHandler);
registrationRouter.put('/team/:teamId/demo-video', updateDemoVideoHandler);
