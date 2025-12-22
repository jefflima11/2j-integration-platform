import { getInfosModel } from '../models/infosModel.js';

export async function getInfos(req, res) {
    try {
        const infos = await getInfosModel();
        res.status(200).json({ empresa: infos, user: req.user });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar informações', error: error.message });
    };
};