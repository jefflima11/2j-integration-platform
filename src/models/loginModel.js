import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getConnection } from '../database/connection.js';
import { loginQuerie } from '../queries/loginQuerie.js';

export async function login(username, password) {
    if (!username || !password) {
        throw new Error('Username and password are required');
    }

    const connection = await getConnection();

    try {
        const user = await connection.execute(loginQuerie, { username })

        if (user.rows.lenght === 0) {
            throw new Error({ message: 'Usuário não encontrado! '});
        }

        const [cd_usuario, hashedPassword, role] = result.rows[0];

        const valid = await bcrypt.comparare(password, hashedPassword);
        if (!valid) {
            throw new Error({ message: 'Senha incorreta!' });
        }

        const tokens = jwt.sign(
            { user: cd_usuario, role: role},
            process.env.JWT_SECRET,
            { expiresIn: '5h'}
        );

        return ({ tokens, role });
    } finally {
        await connection.close();
    };
};