import { Router } from 'express';
import { authorize } from '../middlewares/authorize.js';
import { allHospitalBedsStatusController,  checkListFormController} from '../controllers/hospitalBedsController.js'

const router = Router();

router.get('/all-hospital-beds', authorize(['A', 'L']), allHospitalBedsStatusController);

router.post('/check-list-items', authorize(['A', 'L']), checkListFormController);

export default router;