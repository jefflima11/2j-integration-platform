import { Router } from 'express';
import { authorize } from '../middlewares/authorize.js';
import { hospitalBedsStatusController, cleaningRequestController, waitingConfirmationController, updateCleanRequestController, confirmCleanRequestController,  refuseCleanRequestController} from '../controllers/hospitalBedsController.js';

const router = Router();

router.get('/status', authorize(['A','L','N']), hospitalBedsStatusController);
router.get('/cleaning-request', authorize(['A','L','N']), cleaningRequestController);
router.get('/request-waiting-confirmation', authorize(['A','L']),waitingConfirmationController);

router.patch('/update-cleaning-request/:request', authorize(['N','A','L']), updateCleanRequestController);
router.patch('/confirm-cleaning-request/:request', authorize(['A','L']), confirmCleanRequestController);
router.patch('/refuse-cleaning-request/:request', authorize(['A','L']), refuseCleanRequestController);

export default router;