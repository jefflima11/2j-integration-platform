import { getConnection } from '../database/connection.js';

export async function uploadModel(file) {
    const connection = getConnection();

    try {
        
    } catch (err) {
        return err;
    } finally {
        await connection.close();
    }
}