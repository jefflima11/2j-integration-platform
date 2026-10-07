import { getConnection } from '../database/connection.js';
import oracledb from 'oracledb';
import { verifyImpBraQuerie, insertFromToQuerie, consultConfirmQuerie, confirmProceduresQuerie, verifyValidQuerie } from '../queries/billingProceduresQuerie.js';

export async function unconfiguredProcedures() {
    const connection = await getConnection();

    try {
        const verifyImpBra = await connection.execute(verifyImpBraQuerie, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        return verifyImpBra;
    } finally {
        await connection.close();
    }
};

export async function validProcedures(validos) {    
    const connection = await getConnection();

    // if (!connection) {
    //     console.log("Importacao congelada");
    //     return {
    //         code: 501,
    //         msg: "Importação congelada, devido a falta de conexão ao banco de dados"
    //     }
    // };

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


};

export async function confirmProcedures() {
    const connection = await getConnection();

    try {

        const { rows: verifyValid } = await connection.execute(verifyValidQuerie, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        if (verifyValid.length > 0) {
            return { 
                code: 409,
                msg: 'ja existe atualizacao com a competencia atual' 
            };
        };

        const { rows: confirmProcedures } = await connection.execute(consultConfirmQuerie, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        if (confirmProcedures.length === 0) {
            return {
                code: 409,
                msg: 'Não existe importação a ser confirmada.'
            };
        };

        const proceduresToUpdate = await connection.executeMany(
            confirmProceduresQuerie,
            confirmProcedures.map(item => ({
                pro_fat: item.CD_PRO_FAT,
                new_value: item.NEW_VALUE
            })),
            { autoCommit: true }
        );
        
        console.log('Atualização de tabela de procedimentos concluída com sucesso!');

        await connection.execute('delete from dbahums.de_para_hums', [], { autoCommit: true });
        console.log('Tabela de de-para limpa com sucesso!');


        return {
            code: 200,
            msg: 'Processo de confirmação da importação finalizado.',
            qtd: proceduresToUpdate.rowsAffected
        };

    } finally {
        await connection.close();
    }
};

export async function deleteCompetence() {
    const connection = await getConnection();

    const { rows: verifyLastCompetence } = await connection.execute(`
            select
                1
            from 
                    dbamv.val_pro 
            where 
                trunc(dt_vigencia, 'mm') = trunc(sysdate, 'mm')
                and trunc(dt_vigencia, 'yyyy') = trunc(sysdate, 'yyyy')
                and cd_tab_fat = 1
            group by 1
        `,
        [],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (verifyLastCompetence.length === 0) {
        return {
            code: 201,
            msg: 'Não foi póssivel deletar, não existe competência atual, atualizada.'
        };
    };


    try {
        // 
        await connection.execute(`
                delete
                from 
                    dbamv.val_pro 
                where 
                    trunc(dt_vigencia, 'mm') = trunc(sysdate, 'mm')
                    and trunc(dt_vigencia, 'yyyy') = trunc(sysdate, 'yyyy')
                    and cd_tab_fat = 1
            `,
            [],
            { autoCommit: true }
        );
        console.log('Ultima vigencia de valores deletada.')

        return {
            code: 200,
            msg: 'Última competência deletada com sucesso!'
        };

    } catch(err) {
        // 
        return {
            code: 500,
            msg: 'Erro ao tentar deletar última competência.',
            error: err
        };

    } finally {
        await connection.close();
    }
}