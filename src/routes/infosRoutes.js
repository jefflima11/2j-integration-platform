import { Router } from 'express';
import { imageLogo } from '../controllers/imageController.js';
import { infosController } from '../controllers/infosController.js';
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get('/', authMiddleware, infosController);
router.get('/logo', imageLogo);

export default router;