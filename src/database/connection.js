import oracledb from 'oracledb';
import { getDbConfig } from './configuration.js';

let pool;

export async function initDB() {
    if (pool) return pool;

    const config = getDbConfig();

    if (!config) {
        return { message: 'teste'};
    }

    try {
        oracledb.initOracleClient({ libDir: config.dirDB });

        pool = await oracledb.createPool({
            user: config.userDB,
            password: config.passwordDB,
            connectString: config.connectDB,
            PoolMin: 1,
            poolMax: 20,
            poolIncrement: 2,
            queueTimeout: 10000
        });
        console.log('Pool de conexão criada.');
    } catch (err) {
        console.log(err);
        return;
    };
};

export async function closeDB() {
    try {
        if (pool) {
            await pool.close(0);
            console.log('Pool de conexão fechado.')
        }
    } catch (err) {
        console.error('Erro ao fechar o Pool de conexão', err);
    };
};

export async function getConnection() {
    if (!pool) {
        throw new Error('Pool não inicializado. Chamar função iniDB() primeiro.');
    }

    return pool.getConnection();
}