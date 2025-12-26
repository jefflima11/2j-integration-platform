import { Router } from 'express';
import { authorize } from '../middlewares/authorize.js';
import { employeesController } from '../controllers/employeesController.js';

const router = Router();

router.get('/all', authorize(['A','L']), employeesController);

export default router;