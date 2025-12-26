import { loginModel } from '../models/loginModel.js';

export async function loginController(req, res) {
    const { username, password } = req.body;

    try {
        const loggingIn = await loginModel(username, password);
        res.status(200).json(loggingIn);
    } catch (error) {
        res.status(401).json({ error: error.message });
    };
};

export default { loginController };