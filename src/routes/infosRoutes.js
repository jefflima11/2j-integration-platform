import { Router } from 'express';
import { authorize } from "../middlewares/authorize.js"
import { imageLogo } from '../controllers/imageController.js';
import { getInfos } from '../controllers/infosController.js';
import { employeesController } from '../controllers/employeesController.js';

const router = Router();

router.get('/', getInfos);

router.get('/logo', imageLogo);

router.get('/employees', authorize(['A','L']), employeesController);

export default router;