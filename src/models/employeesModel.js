import { getConnection } from '../database/connection.js';
import { getAllEmployeesQuery } from '../queries/employeeQueries.js';
import oracledb from 'oracledb';

export async function employeesModel() {
    const connection = await getConnection();

    try {
        const {rows: rows} = await connection.execute(getAllEmployeesQuery, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        return  rows;
    } catch (err) {
        return [];
    } finally {
        await connection.close();
    };
};