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

export async function userAlterModel(username, name, role, cpf) {
    const connection = await getConnection();
    
    const fieldsToUpdate = [];
    const binds = { username };

    if(name !== undefined) {
        fieldsToUpdate.push('NM_USUARIO = :name');
        binds.name = name;
    }

    if(role !== undefined) {
        fieldsToUpdate.push('ROLE = :role');
        binds.role = role;
    }


    if(cpf !== undefined) {
        fieldsToUpdate.push('NR_CPF = :cpf');
        binds.cpf = cpf;
    }

    if (fieldsToUpdate.length === 0) {
        throw new Error('Nenhum campo para atualizar.');
    }

    const sql = `
        UPDATE DBAHUMS.USERS SET
            ${fieldsToUpdate.join(', ')},
            UPDATED_AT = SYSDATE
        WHERE CD_USUARIO = :username
    `;


    try {
        const userAltered = await connection.execute(sql, binds, { autoCommit: true });
        return { message: userAltered };
    
    } finally {
        await connection.close();
    }
};