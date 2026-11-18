import { getConnection } from '../database/connection.js';
import oracledb from 'oracledb';
import { patientInfoQuery, allPatientsQuerie } from '../queries/satisfactionSurveyQueries.js';

export async function patientInfo(cdPatient) {
    const connection = await getConnection();

    try {
        const { rows: rows } = await connection.execute(patientInfoQuery, { cdPatient }, { outFormat: oracledb.OUT_FORMAT_OBJECT });

        return rows;
    } catch (error) {
        throw new Error('Erro ao buscar informações do paciente');
    } finally {
        connection.close();
    }
};

export async function infoAllPatients() {
    const connection = await getConnection();

    try {
        const r = await connection.execute(
            allPatientsQuerie,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (r.rows.length === 0) {
            return {
                code: 200,
                msg: 'Nenhum Atendimento com alta hospitalar encontrado'
            }
        }

        return {
            code: 200,
            msg: {
                data: r.rows,
                total: r.rows.length
            }
        };
    } catch (err) {
        return {
            code: 500,
            msg: err.message
        };
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};