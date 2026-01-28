import oracledb from 'oracledb';
let pool = null;

export async function createPool(config) {
    if (pool) return pool;

    oracledb.initOracleClient({ libDir: config.dirDB });

    pool = await oracledb.createPool({
        user: config.userDB,
        password: config.passwordDB,
        connectString: config.connectDB,
        poolMin: 1,
        poolMax: 5,
        poolIncrement: 2,
        queueTimeout: 10000
    });

    return pool;
}

export function isPoolReady() {
    return !!pool;
}

export async function getConnection() {
    if (!pool) {
        throw new Error('Banco não configurado');
    }

    const conn = await pool.getConnection();
    conn.callTimeout = 15000;
    return conn;
}
