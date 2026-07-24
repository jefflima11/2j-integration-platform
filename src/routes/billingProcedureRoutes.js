import { Router } from 'express';
import { authorize } from '../middlewares/authorize.js';
import { importFileController, insertDataController } from '../controllers/billingProcedureController.js';
import { upload } from '../services/uploadService.js';


const router = Router();

// router.post('/import', authorize(['A','L']), upload.single('file'), importFileController);
// router.post('/process',authorize(['A','L']), processDataController);

router.post('/import', upload.single('file'), importFileController);
router.post('/update', insertDataController);

export default router;