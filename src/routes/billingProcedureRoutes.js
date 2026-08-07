import { Router } from 'express';
import { authorize } from '../middlewares/authorize.js';
import { importFileController, insertDataController } from '../controllers/billingProcedureController.js';
import { upload } from '../services/uploadService.js';

const router = Router();

router.post('/import', upload.single('file'), importFileController);
router.post('/update', insertDataController);

export default router;