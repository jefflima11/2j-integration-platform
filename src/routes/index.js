import { Router } from 'express';
import login from './loginRoutes.js';
import users from './userRoutes.js';

const router = Router();

router.get('/teste', (req, res) => {
    res.status(200).json('teste')
});

router.use('/login', login);

router.use('/users', users);

export default router;