const insertNewUser = `INSERT INTO dbahums.USERS 
    (CD_USUARIO, PASSWORD, NM_USUARIO, CREATED_AT, ROLE)
    VALUES 
    (:username, :password, :name, SYSDATE, :role)
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

export default {
    insertNewUser,
    allUsers,
    checkUserExistence,
    updatePasswordQuerie,
    inactiveFilter,
    inactiveUser
}