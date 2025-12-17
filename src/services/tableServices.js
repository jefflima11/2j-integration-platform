import { getConnection } from "../database/connection.js";

export async function verifica_tabelas() {
    const con = await getConnection();

    try {
        const seq = await con.execute(`
            Select
                sequence_name
            From
                All_Sequences
            Where
                sequence_name = 'SEQ_PAD_PRO'
        `);

        if (!seq || seq.rows.length === 0) {
            try {
                await con.execute(`
                    CREATE SEQUENCE  
                        DBAHUMS.SEQ_PAD_PRO  MINVALUE 1 MAXVALUE 9999999999999999999999999999 
                    INCREMENT BY 1 START WITH 1 CACHE 20 NOORDER  NOCYCLE
                    `,[], { autoCommit: true });
    
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
        const result = await con.execute(`
            select 
                1
            from
                dbahums.pad_pro_hums
        `);

        if(!result) {
            console.log("Tabela de padronização criada com sucesso.");
        }

    } catch(error) {
        if(error.code === 'ORA-00942') { 
            try {
                await con.execute(`
                    CREATE TABLE DBAHUMS.PAD_PRO_HUMS (
                        CD_PAD_PRO INT PRIMARY KEY,
                        CD_PRODUTO INT NOT NULL,
                        SN_BLO_COM VARCHAR2(1) NOT NULL,
                        SN_PADRONIZADO VARCHAR2(1) NOT NULL,
                        SN_CONTROLADO VARCHAR2(1) NOT NULL,
                        DT_ALTERACAO DATE NOT NULL,
                        DT_ULTIMA_MOVIMENTACAO DATE NOT NULL,
                        DS_OBSERVACAO VARCHAR2(500),
                        CD_USUARIO VARCHAR(55) NOT NULL
                    )
                    `,[], { autoCommit: true });
                    console.log("Tabela de padronização criada com sucesso.");
            } catch(createError) {
                console.error("Erro ao criar tabela de padronização:", createError);
            }  
        }
    } 
}