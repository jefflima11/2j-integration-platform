import { employeeModel } from '../models/employeeModel.js';

export async function employeeController(req, res) {
    try {
        const getAllEmployees = await employeeModel();
        res.status(200).json(getAllEmployees);
    } catch (err) {
        res.status(500).json({ error: 'Falha ao retornar funcionários' });
    };
}