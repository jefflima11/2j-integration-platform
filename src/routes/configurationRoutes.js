import { Router } from 'express';
import { databaseController } from '../controllers/databaseController.js'

const router = Router();

router.post('/database', databaseController);

export default router;