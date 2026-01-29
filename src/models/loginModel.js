import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getConnection } from '../database/connection.js';
import { loginQuerie } from '../queries/loginQuerie.js';
import { getDbConfig } from '../database/configuration.js'

export async function loginModel(username, password) {
    const config = getDbConfig();
    if (!config) {
        throw new Error('Banco não configurado');
    }

    if (!username || !password) {
        throw new Error('Usuário e senha são obrigatórios');
    }

    let connection;

    try {
        connection = await getConnection();

        const user = await connection.execute(loginQuerie, { username });

        if (user.rows.length === 0) {
            throw new Error('Usuário não encontrado');
        }

        const [cd_usuario, hashedPassword, role] = user.rows[0];

        const valid = await bcrypt.compare(password, hashedPassword);
        if (!valid) {
            throw new Error('Senha incorreta');
        }

        const tokens = jwt.sign(
            { user: cd_usuario, role },
            config.secretKeyDB,
            { expiresIn: '1h' }
        );

        return { tokens, role };

    } finally {
        if (connection) {
            await connection.close();
        }
    }
}
