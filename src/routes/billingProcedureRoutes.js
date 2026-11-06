import { Router } from 'express';
import { authorize } from '../middlewares/authorize.js';
import { importFileController, insertDataController, deleteCompetenceController, deleteLastCompetenceController, getCompetenceController } from '../controllers/billingProcedureController.js';
import { upload } from '../services/uploadService.js';

const router = Router();

router.get('/return-competence-analytics',
    authorize(['A']),
    (req, res) => getCompetenceController(req, res, 'A')
);
router.get('/return-competence-synthetic',
    authorize(['A']),
    (req, res) => getCompetenceController(req, res, 'S')
);

router.post('/import', authorize(['A']), upload.single('file'), importFileController);
router.post('/update', authorize(['A']), insertDataController);

router.delete('/delete', authorize(['A']), deleteCompetenceController)
router.delete('/delete/last-competence', authorize(['A']), deleteLastCompetenceController);
router.delete('/delete/last-competence/:idTable', authorize(['A']), deleteLastCompetenceController)

export default router;