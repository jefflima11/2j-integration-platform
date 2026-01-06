import { Router } from 'express';
import { authorize } from '../middlewares/authorize.js';
import { uploadController } from '../controllers/procedurePricingUpdaterController.js';
// import { upload } from '../services/uploadService.js';

const router = Router();

router.post('/upload', authorize(['A','L']), uploadController);

export default router;