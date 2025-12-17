export const loginQuerie = `SELECT CD_USUARIO, PASSWORD, ROLE
             FROM DBAHUMS.USERS
             WHERE CD_USUARIO = :username`;