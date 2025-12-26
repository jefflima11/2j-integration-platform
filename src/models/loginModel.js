import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getConnection } from '../database/connection.js';
import { loginQuerie } from '../queries/loginQuerie.js';

export async function loginModel(username, password) {
    if (!username || !password) {
        return 'Usuário e senha são obrigatorios!';
    }

    const connection = await getConnection();

    try {
        const user = await connection.execute(loginQuerie, { username })

        if (user.rows.length === 0) {
            throw new Error({ message: 'Usuário não encontrado! '});
        }

        const [cd_usuario, hashedPassword, role] = user.rows[0];

        const valid = await bcrypt.compare(password, hashedPassword);
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