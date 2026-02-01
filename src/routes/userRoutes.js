import { Router } from 'express';
import { authorize } from "../middlewares/authorize.js"
import userController from '../controllers/userController.js';


const router = Router();

router.get('/all', authorize(['A','L']), userController.allUsers)

router.post('/new', authorize(['A', 'L']), userController.newUser);

router.patch('/alter-password', authorize(['A','L','N', 'O']), userController.alterPassword);
router.patch('/user-alter/:username', authorize(['A']), userController.userAlter);
router.patch('/inactivate/:username', authorize(['A']), userController.inactivateUser);

export default router;