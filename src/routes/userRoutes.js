import { Router } from 'express';
import { authorize } from "../middlewares/authorize.js"
import { newUser, allUsers, alterPassword, inactivateUser } from '../controllers/userController.js';


const router = Router();

router.get('/all', allUsers, authorize(['A','L']))

router.post('/new', newUser, authorize(['A', 'L']));

router.patch('/alter-password', alterPassword, authorize(['A']));

router.patch('/inactivate/:username', inactivateUser, authorize(['A']));

export default router;