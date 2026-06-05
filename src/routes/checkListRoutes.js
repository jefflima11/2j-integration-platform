import { Router } from 'express';
import { authorize } from '../middlewares/authorize.js';
import { allHospitalBedsStatusController } from '../controllers/hospitalBedsController.js'

const router = Router();

router.get('/all-hospital-beds', authorize(['A', 'L', 'N']), allHospitalBedsStatusController);

export default router;