import { Router } from 'express';
import { authMiddleware } from "../middlewares/authMiddleware.js";
import login from './loginRoutes.js';
import users from './userRoutes.js';
import product from './productRoutes.js';
import infos from './infosRoutes.js';

const router = Router();

router.use('/inf', infos);

router.use('/login', login);

router.use('/users', authMiddleware, users);

router.use('/products',authMiddleware, product);

export default router;