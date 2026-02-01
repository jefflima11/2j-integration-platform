import { getConnection } from '../database/connection.js';
import oracledb from 'oracledb';
import { patientInfoQuery } from '../queries/satisfactionSurveyQueries.js';

export async function patientInfo(cdPatient) {
    const connection = await getConnection();

    try {
        const {rows: rows} = await connection.execute(patientInfoQuery, {cdPatient}, { outFormat: oracledb.OUT_FORMAT_OBJECT });

        return rows;
    } catch (error) {
        throw new Error('Erro ao buscar informações do paciente');
    } finally {
        connection.close();
    }
};