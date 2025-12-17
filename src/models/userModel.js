import oracledb from 'oracledb';
import bcrypt from 'bcrypt';
import { getConnection } from '../database/connection.js'
import { allUsers as allUsersQuerie,  checkUserExistence as checkUserExistenceQuerie, updatePasswordQuerie } from '../queries/userQuerie.js'

export async function allUsers() {
    const connection = await getConnection();

    try {
        const users = await connection.execute(allUsersQuerie, {}, { outFormat: oracledb.OUT_FORMAT_OBJECT });

        return users.rows;
    } finally {
        await connection.close();
    };
};

export async function alterPassword(username, newPassword) {
    const connection = await getConnection();

    if (!username) {
        return ({ message: 'Nome de usuário é obrigatório!' });
    }
    
    try {
        const userExistence = await connection.execute(checkUserExistenceQuerie, { username });        

        if (userExistence.rows.length === 0 ) {
            return ({ message: 'Usuário não encontrado' });
        };
    } catch (err) {
        res.json(err);
    };
    

    if (!newPassword && !req.password) {
        return ({ message: 'Nova senha é obrigatória' });
    };

    
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await connection.execute(updatePasswordQuerie, { hashedPassword, username });

        await connection.commit();

        return { message: 'Senha alterada com sucesso!' };
    } finally {
        await connection.close();
    };
};