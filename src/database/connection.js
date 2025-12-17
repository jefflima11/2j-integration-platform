import oracledb from 'oracledb';
import dotenv from 'dotenv';

dotenv.config();

let pool;

export async function initDB() {
    try {
        oracledb.initOracleClient({ libDir: process.env.DB_DIR });

        pool = await oracledb.createPool({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECT,
            PoolMin: 1,
            poolMax: 20,
            poolIncrement: 2,
            queueTimeout: 10000
        });
        console.log('Pool de conexão criada.');
    } catch (err) {
        console.error('Erro ao criar o pool de conexão.', err);
        process.exit(1);
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