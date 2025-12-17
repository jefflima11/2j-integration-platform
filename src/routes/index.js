import { Router } from 'express';
import login from './loginRoutes.js';
import users from './userRoutes.js';
import produtcRoutes from './productRoutes.js';
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.use('/login', login);

router.use('/users', authMiddleware, users);

router.use('/products',authMiddleware, produtcRoutes);

export default router;