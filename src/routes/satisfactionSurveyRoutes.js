import { Router } from 'express';
import { authorize } from '../middlewares/authorize.js'; 
import { getPatientInfo } from '../controllers/satisfactionSurveyController.js';

const router = Router();

router.get('/:cdPatient', authorize(['A','O']), getPatientInfo);

export default router;