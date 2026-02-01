import { Router } from 'express';
import { authMiddleware } from "../middlewares/authMiddleware.js";
import loginRoute from './loginRoutes.js';
import users from './userRoutes.js';
import product from './productRoutes.js';
import infos from './infosRoutes.js';
import hospitalBedsRoute from './hospitalBedsRoutes.js';
import employeesRoute from './employeeRoutes.js';
// import procedurePricingUpdaterRoutes from './procedurePricingUpdaterRoutes.js';
import configurationRoute from './configurationRoutes.js';
import satisfactionSurveyRoute from './satisfactionSurveyRoutes.js';

const router = Router();

router.use('/configuration', configurationRoute)

router.use('/inf', infos);

router.use('/login', loginRoute);

router.use('/users', authMiddleware, users);

router.use('/products',authMiddleware, product);

router.use('/hospital-beds', authMiddleware, hospitalBedsRoute);

router.use('/employees', authMiddleware, employeesRoute);

router.use('/satisfaction-survey', authMiddleware, satisfactionSurveyRoute);

// router.use('/ppu', authMiddleware, procedurePricingUpdaterRoutes)

export default router;