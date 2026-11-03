import { Router } from 'express';
import { authorize } from '../middlewares/authorize.js';
import { importFileController, insertDataController, deleteCompetenceController, deleteLastCompetenceController, getCompetenceController } from '../controllers/billingProcedureController.js';
import { upload } from '../services/uploadService.js';

const router = Router();

router.get('/return-competence-analytics',
    (req, res) => getCompetenceController(req, res, 'A')
);
router.get('/return-competence-synthetic',
    (req, res) => getCompetenceController(req, res, 'S')
);

router.post('/import', upload.single('file'), importFileController);
router.post('/update', insertDataController);

router.delete('/delete', deleteCompetenceController)
router.delete('/delete/last-competence', deleteLastCompetenceController);
router.delete('/delete/last-competence/:idTable', deleteLastCompetenceController)

export default router;