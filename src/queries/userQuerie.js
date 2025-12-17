export const userQuerie = `
    INSERT INTO dbahums.USERS 
    (CD_USUARIO, PASSWORD, NM_USUARIO, CREATED_AT, ROLE)
    VALUES 
    (:username, :password, :name, SYSDATE, :role)
`;