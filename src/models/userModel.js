import oracledb from 'oracledb';
import bcrypt from 'bcryptjs';
import { getConnection } from '../database/connection.js'
import userQueries from '../queries/userQuerie.js'

async function verifyUser(name) {
    const connection = await getConnection();

    let sql = `
        select
            1
        from
            dbamv.funcionario f
            inner join dbahums.users u
              on upper(f.nm_func) = upper(u.nm_usuario)
        where
            (
            upper(f.nm_func) like upper('%jairo sousa%') 
            or f.nm_func like upper('%jairo%')
            )
    `;

    let binds {

    }
    try {
        console.log(name.toUpperCase());

        const r = await connection.execute(
            sql,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        console.log(r.rows)
        return {
            code: 201,
            msg: r.rows
        }
    } catch (err) {
        return {
            code: 501,
            msg: err
        }
    };
}

async function newUser(username, hashedPassword, name, role) {
    const connection = getConnection();

    try {
        const r = await connection.execute(
            userQueries.insertNewUser,
            {
                username,
                password: hashedPassword,
                name,
                role
            },
            { autoCommit: true }
        );

        return res.status(201).json({
            message: 'Usuário criado com sucesso!'
        });

    } catch (err) {
        return {
            code: 501,
            msg: err
        }
    }
}

async function allUsers() {
    const connection = await getConnection();

    try {
        const users = await connection.execute(allUsersQuerie, {}, { outFormat: oracledb.OUT_FORMAT_OBJECT });

        return users.rows;
    } finally {
        await connection.close();
    };
};

async function alterPassword(username, newPassword) {
    const connection = await getConnection();

    if (!username) {
        return ({ message: 'Nome de usuário é obrigatório!' });
    }

    try {
        const userExistence = await connection.execute(checkUserExistenceQuerie, { username });

        if (userExistence.rows.length === 0) {
            return ({ message: 'Usuário não encontrado' });
        };
    } catch (err) {
        return (err);
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

async function inactivateUser(username) {
    const connection = await getConnection();

    try {
        const querieComplete = checkUserExistenceQuerie + inactiveFilter;
        const user = await connection.execute(querieComplete, { username });

        if (user.rows.length > 0) {
            return ({ message: 'Usuário já está inativado!' });
        };
    } catch (err) {
        return err;
    }

    try {
        await connection.execute(inactiveUserQuerie, { username }, { autoCommit: true });
        return { message: 'Usuário inativado!' };
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

async function userAlterModel(username, name, role, cpf) {
    const connection = await getConnection();

    const fieldsToUpdate = [];
    const binds = { username };

    if (name !== undefined) {
        fieldsToUpdate.push('NM_USUARIO = :name');
        binds.name = name;
    }

    if (role !== undefined) {
        fieldsToUpdate.push('ROLE = :role');
        binds.role = role;
    }


    if (cpf !== undefined) {
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

export default {
    newUser,
    allUsers,
    alterPassword,
    inactivateUser,
    userAlterModel,
    verifyUser
}