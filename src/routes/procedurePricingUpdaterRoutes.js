import { Router } from 'express';
import { authorize } from '../middlewares/authorize.js';
import { uploadController } from '../controllers/procedurePricingUpdaterController.js';

const router = Router();

router.post('/upload', authorize(['A','L']), uploadController);

export default router;