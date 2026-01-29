import { Router } from 'express';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { loginController } from '../controllers/loginController.js';

const loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,

    keyGenerator: (req) => {
        const ipKey = ipKeyGenerator(req);
        const username = req.body?.username || 'anon';
        return `${ipKey}-${username}`;
    },

    message: 'Muitas tentativas de login a partir deste endereço IP. Tente novamente em 1 minutos.',
    standardHeaders: true, 
    legacyHeaders: false
});

const router = Router();

router.post("/", loginLimiter, loginController);

export default router;