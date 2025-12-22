import { Router } from 'express';
import { employeeController } from '../controllers/employeeController.js';

const router = Router();

router.get('/employees', employeeController);

export default router;
