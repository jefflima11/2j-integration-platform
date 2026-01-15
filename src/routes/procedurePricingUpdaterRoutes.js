import { Router } from 'express';
import { authorize } from '../middlewares/authorize.js';
import { uploadFile, processData } from '../controllers/procedurePricingUpdaterController.js';


const router = Router();

router.post('/upload', authorize(['A','L']), uploadFile);
router.post('/process-data', authorize(['A','L']), processData);

export default router;