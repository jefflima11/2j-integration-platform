import { getConnection } from '../database/connection.js';
import oracledb from 'oracledb';
import { verifyImpBraQuerie, insertFromToQuerie, consultConfirmQuerie, confirmProceduresQuerie, verifyValidQuerie, verifyImpSimproQuerie, consultConfirmMatQuerie } from '../queries/billingProceduresQuerie.js';
import { importCache } from '../cache/importCache.js';

export async function unconfiguredProcedures() {
    const connection = await getConnection();

    try {
        const verifyImpBra = await connection.execute(verifyImpBraQuerie, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        console.log("  # Retornando verificacao da imp_bra")
        return verifyImpBra;
    } finally {
        await connection.close();
    }
};

export async function unconfiguredProceduresSimpro() {
    const connection = await getConnection();

    try {
        const { rows: verifyImpSimpro } = await connection.execute(
            verifyImpSimproQuerie,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        return verifyImpSimpro;
    } finally {
        await connection.close();
    };
}

export async function validProcedures(preValidValues) {
    const connection = await getConnection();

    try {
        // Limpa a tabela de de-para antes de inserir novos dados
        console.log("  # Limpeza da tabela de importacao")
        await connection.execute('DELETE FROM dbahums.de_para_hums', [], { autoCommit: true });

        // console.log("passou aqui")
        // return
        // Prepara os dados em formato de array de objetos
        const bindDefs = preValidValues.map(item => ({
            tiss: item.tiss,
            valor: item.valor,
            tuss: item.tiss
        }));

        // Executa todas as inserções de uma só vez
        await connection.executeMany(
            insertFromToQuerie,
            bindDefs,
            { autoCommit: true }
        );

        // Verifica os procedimentos de de-para com os procedimentos do imp_bra
        const procedures = await unconfiguredProcedures();

        console.log("  # Retornando informacoes de procedimento");
        console.log("    nao configurados.");
        return procedures;

    } catch (err) {
        return err;
    } finally {
        await connection.close();
    }


};

export async function importProcedures(preValidValues) {
    const connection = await getConnection();

    await connection.execute('DELETE FROM dbahums.de_para_hums', [], { autoCommit: true });
    console.log("limpeza da tabela de importacao")

    try {
        const result = await connection.executeMany(
            insertFromToQuerie,
            preValidValues,
            {
                autoCommit: false,
                bindDefs: {
                    tiss: {
                        type: oracledb.STRING,
                        maxSize: 50
                    },
                    valor: {
                        type: oracledb.NUMBER
                    },
                    tuss: {
                        type: oracledb.STRING,
                        maxSize: 50
                    }
                }
            }
        );
        await connection.commit();

        console.log("Insercao na tabela de importacao realizada!");

        // Veririfica os procedimento de importação com a tabela imp_simpro
        const procedures = await unconfiguredProceduresSimpro();

        return procedures;
    } catch (err) {
        return err;
    } finally {
        await connection.close();
    };
};

export async function confirmProcedures() {
    const connection = await getConnection();

    try {
        // recolhe informações da planilha em cache
        const cache = importCache.get("planilha");

        let codeTable;
        if (cache.tableType === 'med') {
            codeTable = 1;
        } else {
            codeTable = 50;
        };

        const { rows: verifyValid } = await connection.execute(
            verifyValidQuerie,
            { tab_fat: codeTable },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (verifyValid.length > 0) {
            return {
                code: 409,
                msg: 'ja existe atualizacao com a competencia atual'
            };
        };

        let confirmProcedures;
        if (codeTable === 1) {
            confirmProcedures = await connection.execute(
                consultConfirmQuerie,
                [],
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
        } else {
            confirmProcedures = await connection.execute(consultConfirmMatQuerie, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        }

        if (confirmProcedures.length === 0) {
            return {
                code: 409,
                msg: 'Não existe importação a ser confirmada.'
            };
        };

        let proceduresToUpdate = await connection.executeMany(
            confirmProceduresQuerie,
            confirmProcedures.rows.map(item => ({
                pro_fat: item.CD_PRO_FAT,
                new_value: item.NEW_VALUE,
                codeTable
            })),
            { autoCommit: true }
        );


        await connection.execute('delete from dbahums.de_para_hums', [], { autoCommit: true });
        console.log('limpeza de tabela de importacao realizada.');

        return {
            code: 200,
            msg: 'Atualizacao',
            qtd: proceduresToUpdate.rowsAffected,
            codeTable
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
            `,
            [],
            { autoCommit: true }
        );
        console.log('Ultima vigencia de valores deletada.')

        return {
            code: 200,
            msg: 'Última competência deletada com sucesso!'
        };

    } catch (err) {
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


export async function deleteCompetenceId(idTable) {
    const connection = await getConnection();

    const { rows: verifyLastCompetence } = await connection.execute(`
        select
            1
        from
            dbamv.val_pro
        where
            trunc(dt_vigencia, 'mm') = trunc(sysdate, 'mm')
            and trunc(dt_vigencia, 'yyyy') = trunc(sysdate, 'yyyy')
            and cd_tab_fat = 50
        `,
        [],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (verifyLastCompetence.length === 0) {
        return {
            code: 409,
            msg: 'Não foi possivel deletar, a competência informada não existe.'
        }
    }

    try {

        const r = await connection.execute(`
                delete
                from 
                    dbamv.val_pro 
                where 
                    trunc(dt_vigencia, 'mm') = trunc(sysdate, 'mm')
                    and trunc(dt_vigencia, 'yyyy') = trunc(sysdate, 'yyyy')
                    and cd_tab_fat = :idTable
            `,
            [idTable],
            { autoCommit: true }
        );

        console.log({ resultDelete: r.rowsAffected });

        if (r.rowsAffected === 0) {
            return {
                code: 409,
                msg: 'Não existe competência a ser deletada'
            }
        }

        return {
            code: 200,
            msg: `Total de ${r.rowsAffected} registro deletados da tabela ${idTable}`
        }
    } catch (err) {
        return {
            code: 500,
            msg: err
        }
    }

};