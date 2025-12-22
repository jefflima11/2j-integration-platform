import { Router } from 'express';
import { authorize } from '../middlewares/authorize.js';
import { hospitalBedsStatusController, cleaningRequestController, waitingConfirmationController, cleanRequestController } from '../controllers/hospitalBedsController.js';

const router = Router();

router.get('/status', hospitalBedsStatusController);
router.get('/cleaning-request', cleaningRequestController);
router.get('/request-waiting-confirmation', authorize(['A','L']),waitingConfirmationController);

router.patch('/cleaning-request/:request', authorize(['A','L']), cleanRequestController);

export default router;