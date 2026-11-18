import { Router } from 'express';
import { authorize } from '../middlewares/authorize.js';
import { getPatientInfo, getAllPatients } from '../controllers/satisfactionSurveyController.js';

const router = Router();

router.get('/all-pacients-today', authorize(['A', 'O']), getAllPatients)
router.get('/:cdPatient', authorize(['A', 'O']), getPatientInfo);

export default router;