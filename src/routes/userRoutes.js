import { Router } from 'express';
import { newUser } from '../controllers/userController.js';
import { authorize } from "../middlewares/authorize.js"
import { allUsers } from '../controllers/userController.js'

const router = Router();

router.get('/all', allUsers, authorize(['A','L']))

router.post('/new', newUser, authorize(['A', 'L']));

export default router;