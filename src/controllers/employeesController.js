import { employeesModel } from '../models/employeesModel.js';

export async function employeesController(req, res) {
    try {
        const employees = await employeesModel();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar funcionários', error: error.message });
    };
};