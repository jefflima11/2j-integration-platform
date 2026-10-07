import { Router } from 'express';
import { authorize } from '../middlewares/authorize.js';
import { importFileController, insertDataController, deleteCompetenceController, deleteLastCompetenceController } from '../controllers/billingProcedureController.js';
import { upload } from '../services/uploadService.js';

const router = Router();

router.post('/import', upload.single('file'), importFileController);
router.post('/update', insertDataController);

router.delete('/delete', deleteCompetenceController)
router.delete('/delete/last-competence', deleteLastCompetenceController);

export default router;