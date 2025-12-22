import { getConnection } from '../database/connection.js';
import { getAllEmployeesQuery } from '../queries/employeeQueries.js';

export async function employeeController() {
    const connection = await getConnection();

    try {
        const AllEmployees = await connection.query(getAllEmployeesQuery);
        return AllEmployees.rows;
    } catch (err) {
        return { error: 'Erro ao buscar funcionários' };
    } finally {
        await connection.close();
    };
};