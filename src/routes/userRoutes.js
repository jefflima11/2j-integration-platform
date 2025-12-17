import { Router } from 'express';
import { authorize } from "../middlewares/authorize.js"
import { newUser, allUsers, alterPassword } from '../controllers/userController.js';


const router = Router();

router.get('/all', allUsers, authorize(['A','L']))

router.post('/new', newUser, authorize(['A', 'L']));

router.patch('/alter-password', alterPassword, authorize(['A']));

export default router;