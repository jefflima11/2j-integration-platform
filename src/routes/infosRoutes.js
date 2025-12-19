import { Router } from 'express';
import { imageLogo } from '../controllers/imageController.js';

const router = Router();

router.get('/logo', imageLogo);

export default router;