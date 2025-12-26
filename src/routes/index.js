import { Router } from 'express';
import { authMiddleware } from "../middlewares/authMiddleware.js";
import loginRoute from './loginRoutes.js';
import users from './userRoutes.js';
import product from './productRoutes.js';
import infos from './infosRoutes.js';
import hospitalBedsRoute from './hospitalBedsRoutes.js';
import employeesRoute from './employeeRoutes.js';

const router = Router();

router.use('/inf',authMiddleware, infos);

router.use('/login', loginRoute);

router.use('/users', authMiddleware, users);

router.use('/products',authMiddleware, product);

router.use('/hospital-beds', authMiddleware, hospitalBedsRoute);

router.use('/employees', authMiddleware, employeesRoute);

export default router;