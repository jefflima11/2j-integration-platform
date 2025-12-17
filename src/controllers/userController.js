import bcrypt from 'bcrypt';
import { getConnection } from '../database/connection.js';
import { allUsers as allUsersModel } from '../models/userModel.js';


export async function newUser(req, res) {
    const { username, password, name, role } = req.body;

    if (!username || !password || !name || !role) {
        return res.status(400).json({
            message: 'Usuário, senha, nome completo e regra são obrigatórios'
        });
    }

    let connection;

    try {
        connection = await getConnection();

        const hashedPassword = await bcrypt.hash(password, 10);

        await connection.execute(
            userQuerie,
            { username, password: hashedPassword, name, role },
            { autoCommit: true }
        );

        return res.status(201).json({
            message: 'Usuário criado com sucesso!'
        });

    } catch (err) {
        if (err?.errorNum === 1) {
            return res.status(409).json({ message: 'Usuário já existe!' });
        }

        console.error(err);
        return res.status(500).json({ message: 'Erro ao criar usuário' });

    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

export async function allUsers(req, res) {
    try {
        const users = await allUsersModel();
        res.json(users);
    } catch (err) {
        res.json(err)
    }
};

export default { newUser };
