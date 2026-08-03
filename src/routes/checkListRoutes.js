import { Router } from 'express';
import { authorize } from '../middlewares/authorize.js';
import { allHospitalBedsStatusController,  checkListFormController, verifyCheckoutController} from '../controllers/hospitalBedsController.js';
import { uploadSignature } from '../services/uploadService.js';

const router = Router();

router.get('/all-hospital-beds', authorize(['A', 'L']), allHospitalBedsStatusController);
router.get('/verify-checkout/:cdLeito', authorize(['A', 'L']), verifyCheckoutController);

router.post('/check-list-items', authorize(['A', 'L']), uploadSignature.single('signature'), checkListFormController);

export default router;