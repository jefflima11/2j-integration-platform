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