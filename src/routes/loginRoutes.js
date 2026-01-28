import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { loginController } from '../controllers/loginController.js';

const loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5, 
    message: 'Muitas tentativas de login a partir deste endereço IP. Tente novamente em 1 minuto.',
    standardHeaders: true, 
    legacyHeaders: false,
});

const router = Router();

router.post("/", loginLimiter, loginController);

export default router;