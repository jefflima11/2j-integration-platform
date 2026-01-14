import { getConnection } from "../database/connection.js";
import { verifySequence, createSequence, verifyExistTablePadPro, createTablePadPro } from '../queries/tablesQueries.js'

export async function verifica_tabelas() {
    const connection = await getConnection();

    try {
        const seq = await connection.execute(verifySequence);

        if (!seq || seq.rows.length === 0) {
            try {
                await connection.execute(createSequence,[], { autoCommit: true });
    
                console.log("Sequencia de padronização de produtos criada com sucesso.");
            } catch(createError) {
                console.error("Erro ao criar sequencia':", createError);
            }

        }

    } catch(error) {
        if(error.code === 'ORA-02289') { 
        } else {
            console.error(error.message);
        }

    }

    try {
        const result = await connection.execute(verifyExistTablePadPro);

        if(!result) {
            console.log("Tabela de padronização criada com sucesso.");
        }

    } catch(error) {
        if(error.code === 'ORA-00942') { 
            try {
                await connection.execute(createTablePadPro,[], { autoCommit: true });
                    console.log("Tabela de padronização criada com sucesso.");
            } catch(createError) {
                console.error("Erro ao criar tabela de padronização:", createError);
            }  
        }
    } 
}