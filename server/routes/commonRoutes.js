import { Router } from 'express';
import { submitContactMessage } from '../controllers/contactController.js';
import { subscribeNewsletter } from '../controllers/newsletterController.js';
import { getStoreSettings } from '../controllers/settingsController.js';

export const contactRouter = Router();
contactRouter.post('/', submitContactMessage);

export const newsletterRouter = Router();
newsletterRouter.post('/subscribe', subscribeNewsletter);

export const settingsRouter = Router();
settingsRouter.get('/', getStoreSettings);

