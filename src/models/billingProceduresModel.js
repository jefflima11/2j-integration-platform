import { getConnection } from '../database/connection.js';
import oracledb from 'oracledb';
import { verifyImpBraQuerie, insertFromToQuerie,  consultConfirmQuerie, confirmProceduresQuerie } from '../queries/billingProceduresQuerie.js';

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

    console.log(`Total de procedimentos válidos para inserção em de-para: ${validos.length}`);
    const tempoDoProcesso = validos.length
    const contador = 0;

    try {

        // Prepara os dados em formato de array de objetos
        const bindDefs = validos.map(item => ({
            tiss: item.tiss,
            valor: item.valor
        }));

        // Executa todas as inserções de uma só vez
        const result = await connection.executeMany(
            insertFromToQuerie,
            bindDefs,
            { autoCommit: true }
        );

        const contador = result.rowsAffected;
        console.log(`Total de registros inseridos: ${contador}`);

        console.log('Procedimentos válidos inseridos com sucesso.');
        return procedures;
        
    } catch (err) {
        return err;
    } finally {
       await connection.close();
    }


}

export async function confirmProcedures() {
    // console.log('confirmProcedures called');
    const connection = await getConnection();

    try {
        const { rows: confirmProcedures } = await connection.execute(consultConfirmQuerie, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        // const proceduresToUpdate = await connection.executeMany(
        //     confirmProceduresQuerie,
        //     {  pro_fat: confirmProcedures.pro_fat, new_value: confirmProcedures.new_value },
        //     { autoCommit: true }
        // );
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
        
        // confirmProcedures.forEach(item => {
        //     const proceduresToUpdate = connection.execute(
        //         confirmProceduresQuerie,
        //         {
        //             tiss: item.cd_tiss,
        //             pro_fat: item.cd_pro_fat,
        //             new_value: item.new_value
        //         },
        //         { autoCommit: true }
        //     );
        // });

        // return;
    } finally {
        await connection.close();
    }
}