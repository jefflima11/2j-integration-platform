const insertNewUser = `
    INSERT INTO dbahums.USERS (
        CD_USUARIO, 
        PASSWORD, 
        NM_USUARIO, 
        CREATED_AT, 
        ROLE,
        NR_CPF
    ) VALUES (
        :username, 
        :password, 
        :name, 
        SYSDATE, 
        :role,
        :cpf
    )
`;

const allUsers = `SELECT 
    CD_USUARIO, 
    NM_USUARIO, 
    DECODE(ROLE, 'N', 'Normal', 'A', 'Administrador', 'L', 'Concierge', 'O', 'Outros') ROLE
    FROM DBAHUMS.USERS
`;

const checkUserExistence = `SELECT CD_USUARIO
    FROM DBAHUMS.USERS
    WHERE CD_USUARIO = :username
`;

const updatePasswordQuerie = `UPDATE DBAHUMS.USERS
    SET 
    PASSWORD = :hashedPassword,
    UPDATED_AT = SYSDATE
    WHERE CD_USUARIO = :username
`;

const inactiveFilter = `AND INATIVATED_AT IS NOT NULL`;

const inactiveUser = `UPDATE DBAHUMS.USERS
    SET 
    INATIVATED_AT = SYSDATE,
    UPDATED_AT = SYSDATE
    WHERE CD_USUARIO = :userName
`;

const insertNewEmployee = `
    insert into dbamv.funcionario (
        cd_func,
        nm_func,
        sn_ativo,
        cd_setor,
        cd_func_integra,
        nr_cpf,
        sn_internet
    ) values (
        dbamv.seq_func.nextval,
        :name,
        'S',
        :codSetor,
        :usu,
        :cpf,
        'N'
    )
`;

export default {
    insertNewUser,
    allUsers,
    checkUserExistence,
    updatePasswordQuerie,
    inactiveFilter,
    inactiveUser,
    insertNewEmployee
}