import { Router } from 'express';
import { imageLogo } from '../controllers/imageController.js';
import { infosController } from '../controllers/infosController.js';

const router = Router();

router.get('/', infosController);

router.get('/logo', imageLogo);

export default router;