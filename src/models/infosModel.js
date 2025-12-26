import { getConnection } from '../database/connection.js';
import { infosQueries } from '../queries/infosQueries.js';

export async function infosModel() {
    const connection = await getConnection();

    try {
        const { rows: [[infos]]  } = await connection.execute(infosQueries); 
        return infos;
    } catch (err) {
        return err;
    } finally {
        await connection.close();
    };
};