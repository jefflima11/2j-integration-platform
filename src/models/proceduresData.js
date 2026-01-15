import { getConnection } from '../database/connection.js';
import { verifyImpBraQuerie } from '../queries/proceduresQueries.js';

export async function unconfiguredProcedures() {
    const connection = await getConnection();

    try {
        const verifyImpBra = await connection.execute(verifyImpBraQuerie, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        return verifyImpBra;
    } finally {
        await connection.close();
    }
}