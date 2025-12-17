import { getConnection } from '../database/connection.js'
import { allUsers as allUsersQuerie } from '../queries/userQuerie.js'
import oracledb from 'oracledb';

export async function allUsers() {
    const connection = await getConnection();

    try {
        const users = await connection.execute(allUsersQuerie, {}, { outFormat: oracledb.OUT_FORMAT_OBJECT });

        return users.rows;
    } finally {
        await connection.close();
    };
};