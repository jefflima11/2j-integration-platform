import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getConnection } from '../database/connection.js';
import { loginQuerie } from '../queries/loginQuerie.js';
import { initDB } from '../database/connection.js';
import { getDbConfig } from '../database/configuration.js'
import { verifica_tabelas } from '../services/tableServices.js'

export async function loginModel(username, password) {
    await initDB();
    await verifica_tabelas();

    const config = getDbConfig();

    if (!username || !password) {
        throw new Error ( 'Usuário e senha são obrigatorios!' );
    }

    const connection = await getConnection();

    try {
        const user = await connection.execute(loginQuerie, { username })

        if (user.rows.length === 0) {
            throw new Error ( 'Usuário não encontrado! ');
        }

        const [cd_usuario, hashedPassword, role] = user.rows[0];

        const valid = await bcrypt.compare(password, hashedPassword);
        if (!valid) {
            throw new Error ( 'Senha incorreta!' );
        }

        const tokens = jwt.sign(
            { user: cd_usuario, role: role},
            config.secretKeyDB,
            { expiresIn: '5h'}
        );

        return ({ tokens, role });
    } finally {
        await connection.close();
    };
};