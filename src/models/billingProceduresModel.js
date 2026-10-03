import { getConnection } from '../database/connection.js';
import oracledb from 'oracledb';
import { verifyImpBraQuerie, insertFromToQuerie,  consultConfirmQuerie, confirmProceduresQuerie, verifyValidQuerie } from '../queries/billingProceduresQuerie.js';

export async function unconfiguredProcedures() {
    const connection = await getConnection();

    try {
        const verifyImpBra = await connection.execute(verifyImpBraQuerie, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        return verifyImpBra;
    } finally {
        await connection.close();
    }
}

export async function validProcedures(validos) {
    const connection = await getConnection();

    // Criar função para verificar se já existe dados na tabela de de-para antes de inserir novos dados

    try {

        // Limpa a tabela de de-para antes de inserir novos dados
        await connection.execute('DELETE FROM dbahums.de_para_hums', [], { autoCommit: true });

        // Prepara os dados em formato de array de objetos
        const bindDefs = validos.map(item => ({
            tiss: item.tiss,
            valor: item.valor
        }));

        // Executa todas as inserções de uma só vez
        await connection.executeMany(
            insertFromToQuerie,
            bindDefs,
            { autoCommit: true }
        );

        // Verifica os procedimentos de de-para com os procedimentos do imp_bra
        const procedures = await unconfiguredProcedures();

        return procedures;
        
    } catch (err) {
        return err;
    } finally {
       await connection.close();
    }


}

export async function confirmProcedures() {
    const connection = await getConnection();

    try {

        const { rows: verifyValid } = await connection.execute(verifyValidQuerie, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        
        if (verifyValid[0].QTD > 0) {
            return {msg: 'ja existe atualizacao com a competencia atual', verifyValid};
        }

        const { rows: confirmProcedures } = await connection.execute(consultConfirmQuerie, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        const proceduresToUpdate = await connection.executeMany(
            confirmProceduresQuerie,
            confirmProcedures.map(item => ({
                pro_fat: item.CD_PRO_FAT,
                new_value: item.NEW_VALUE
            })),
            { autoCommit: true }
        );
        
        console.log(proceduresToUpdate);
        console.log('confirmProcedures executed successfully');
        return proceduresToUpdate;
    
    } finally {
        await connection.close();
    }
}