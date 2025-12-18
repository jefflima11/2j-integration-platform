export const userQuerie = `INSERT INTO dbahums.USERS 
    (CD_USUARIO, PASSWORD, NM_USUARIO, CREATED_AT, ROLE)
    VALUES 
    (:username, :password, :name, SYSDATE, :role)
`;

export const allUsers = `SELECT 
    CD_USUARIO, 
    NM_USUARIO, 
    DECODE(ROLE, 'N', 'Normal', 'A', 'Administrador', 'L', 'Concierge') ROLE
    FROM DBAHUMS.USERS
`;

export const checkUserExistence = `SELECT CD_USUARIO
    FROM DBAHUMS.USERS
    WHERE CD_USUARIO = :username
`;

export const updatePasswordQuerie = `UPDATE DBAHUMS.USERS
    SET 
    PASSWORD = :hashedPassword,
    UPDATED_AT = SYSDATE
    WHERE CD_USUARIO = :username
`;

export const inactiveFilter = `AND INATIVATED_AT IS NOT NULL`;

export const inactiveUser = `UPDATE DBAHUMS.USERS
    SET 
    INATIVATED_AT = SYSDATE,
    UPDATED_AT = SYSDATE
    WHERE CD_USUARIO = :userName
`;