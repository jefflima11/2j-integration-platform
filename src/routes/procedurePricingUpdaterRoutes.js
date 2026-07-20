import { Router } from 'express';
import { authorize } from '../middlewares/authorize.js';
import { importFileController, processData } from '../controllers/procedurePricingUpdaterController.js';
import { upload } from '../services/uploadService.js';


const router = Router();

router.post('/import', authorize(['A','L']), importFileController);
router.post('/process-data', authorize(['A','L']), processData);

export default router;