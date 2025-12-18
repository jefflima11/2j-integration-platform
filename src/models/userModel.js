import oracledb from 'oracledb';
import bcrypt from 'bcrypt';
import { getConnection } from '../database/connection.js'
import { allUsers as allUsersQuerie,  checkUserExistence as checkUserExistenceQuerie, updatePasswordQuerie, inactiveFilter, inactiveUser as inactiveUserQuerie } from '../queries/userQuerie.js'

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
        return(err);
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

export async function inactivateUser(username) {
    const connection = await getConnection();

    try {
        const querieComplete = checkUserExistenceQuerie + inactiveFilter;
        const user = await connection.execute(querieComplete, { username });

        if  (user.rows.length > 0 ) {
            return ({ message: 'Usuário já está inativado!' });
        };
    } catch (err) {
        return err;
    } 

    try {
        await connection.execute(inactiveUserQuerie, { username }, { autoCommit: true });
        return { message: 'Usuário inativado!'};
    } catch (err) {
        if (err.errorNum === 1) {
            return { message: 'Usuário não encontrado!' };
        } else {
            return err;
        };
    } finally {
        if (connection) {
            await connection.close();
        };
    };
};