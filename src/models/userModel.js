import oracledb from 'oracledb';
import bcrypt from 'bcryptjs';
import { getConnection } from '../database/connection.js'
import userQueries from '../queries/userQuerie.js'

async function verifyEmployee(employeeData) {
    const connection = await getConnection();

    let sql = `
        select
            cd_func,
            nm_func,
            sn_ativo,
            vl_hora,
            vl_hora_extra,
            dt_vigencia
        from
            dbamv.funcionario f
            left join dbahums.users u
              on upper(f.nm_func) = upper(u.nm_usuario)
        where
            f.nm_func like '%' || :name || '%'
            
    `;

    try {
        const r = await connection.execute(
            sql,
            { name: employeeData.name },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (r.rows.length > 0) {
            return {
                code: 409,
                msg: `Existem ${r.rows.length} funcionários cadastrados com nome similar`
            }
        } else {
            let binds = {
                name: employeeData.name,
                codSetor: 38,
                cpf: employeeData.cpf,
                usu: employeeData.user
            };

            await connection.execute(
                userQueries.insertNewEmployee,
                binds,
                { autoCommit: true }
            );

            return {
                code: 201,
                msg: {
                    text: 'Funcionário cadastrado com sucesso.',
                    error: null
                }
            }
        }

    } catch (err) {
        return {
            code: 501,
            msg: err
        }
    } finally {
        if (connection) {
            await connection.close();
        }
    };
};

async function verifyUser(nome) {
    const connection = await getConnection();

    let sql = `
        select
            cd_usuario,
            nm_usuario
        from
            dbahums.users
        where
            nm_usuario like '%' || :nome || '%'
    `;

    try {
        const r = await connection.execute(
            sql,
            { nome },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (r.rows.length > 0) {
            return {
                code: 409,
                msg: `Usuário já cadastrado`
            }
        }

        return {
            code: 201,
            msg: 'Usuário cadastrado com sucesso'
        }
    } catch (err) {
        return {
            code: 501,
            msg: {
                text: "Falha na verificação do novo usuário",
                error: err.message
            }
        }
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

async function newUser(userData) {
    const connection = await getConnection();

    try {

        await connection.execute(
            userQueries.insertNewUser,
            {
                username: userData.username,
                password: userData.hashedPassword,
                name: userData.name,
                role: userData.role,
                cpf: userData.cpf
            },
            { autoCommit: true }
        );

        return {
            code: 201,
            msg: {
                text: 'Usuário cadastrado com sucesso',
                error: null
            }
        }
    } catch (err) {
        return {
            code: 501,
            msg: {
                text: `Falha ao tentar criar novo usuário.`,
                error: err.message
            }
        }
    } finally {
        if (connection) {

        }
    }
}

async function allUsers() {
    const connection = await getConnection();

    try {
        const users = await connection.execute(
            userQueries.allUsers,
            {},
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

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

async function validateEmployee(codFunc) {
    const connection = await getConnection();

    const sql = `
        select
            cd_func,
            nm_func
        from
            dbamv.funcionario f
            inner join dbahums.users u
              on f.nm_func = upper(u.nm_usuario)
        where
            cd_func = :codFunc
    `;

    try {

        const r = await connection.execute(
            sql,
            { codFunc },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (r.rows > 0) {
            return {
                code: 409,
                msg: 'Já existe usuário vinculado ao código de funcionário informado.'
            }
        } else {
            return
        }

    } catch (err) {
        return {
            code: 501,
            msg: err
        }
    }
}

export default {
    newUser,
    allUsers,
    alterPassword,
    inactivateUser,
    userAlterModel,
    verifyEmployee,
    verifyUser,
    validateEmployee
}