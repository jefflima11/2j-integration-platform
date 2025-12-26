import { infosModel } from '../models/infosModel.js';

export async function infosController(req, res) {
    try {
        const infos = await infosModel();
        res.status(200).json({ empresa: infos, user_logged: req.user.user });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar informações', error: error.message });
    };
};