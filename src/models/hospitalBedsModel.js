import { getConnection } from '../database/connection.js';
import oracledb from 'oracledb';
import { allHospitalBedsStatusQuery, hospitalBedsStatusQuery, cleaningRequestQuery, waitingConfirmationQuery, verifyRequestQuery, startCleaningQuery, updateAfterCleaningQuery, requestCompleteQuery, checkEmployeeQuery, confirmationRequestQuery, refuseCleanRequestQuery, checkListFormQuery } from '../queries/hospitalBedsQueries.js';

export async function allHospitalBedsStatusModel() {
    const connection = await getConnection();

    try {
        const { rows: allHospitalBedsStatus } = await connection.execute(allHospitalBedsStatusQuery, [], 
                { outFormat: oracledb.OUT_FORMAT_OBJECT}
            );
        return allHospitalBedsStatus;
    } catch (err) {

    } finally {
        await connection.close();
    };
};

export async function hospitalBedsStatusModel() {
    const connection = await getConnection();

    try {
        const {rows: hospitalBedsStatus} = await connection.execute(hospitalBedsStatusQuery, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        return hospitalBedsStatus;
    } catch(err) {
        return err;
    } finally {
        await connection.close();
    };
};

export async function cleaningRequestModel() {
    const connection = await getConnection();

    try {
        const {rows: cleaningRequests} = await connection.execute(cleaningRequestQuery, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        return cleaningRequests;
    } catch(err) {
        return err;
    } finally {
        await connection.close();
    };
};

export async function waitingConfirmationModel() {
    const connection = await getConnection();

    try {
        const {rows: waitingConfirmations} = await connection.execute(waitingConfirmationQuery, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        return waitingConfirmations;
    } catch(err) {
        return err;
    } finally {
        await connection.close();
    };
};

export async function updateCleanRequestModel(request) {
    const connection = await getConnection();

    try {
        const {rows: [verifyRequest]} = await connection.execute(verifyRequestQuery, [request], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        if (!verifyRequest) {
            return 'Solicitação não encontrada';
        };

        if (verifyRequest['DT_INICIO_HIGIENIZA'] === null) {
            const cleaningRequest = await connection.execute(startCleaningQuery, [request], { autoCommit: true });

            if (cleaningRequest.rowsAffected === 1) {
                cleaningRequest.updateMessage = 'Limpeza iniciada com sucesso';
            }

            return cleaningRequest.updateMessage;
        } else if (verifyRequest['DT_HR_INI_ROUPARIA'] === null) {
            //ainda não implementado
        } else if (verifyRequest['DT_HR_INI_POS_HIGIENIZA'] === null) {
            const afterCleaning = await connection.execute(updateAfterCleaningQuery, [request], { autoCommit: true });
            
            if (afterCleaning.rowsAffected === 1) {
                afterCleaning.updateMessage = 'Pos higienizacao iniciada com sucesso';
            }

            return afterCleaning.updateMessage;
        } else {
            return 'Solicitação aguardando confirmação ou já finalizada';
        }


    } catch(err) {
        return err;
    } finally {
        await connection.close();
    };
};

export async function confirmCleanRequestModel(request, employee, observation) {

    if (!employee) {
        return 'Funcionário é obrigatório para confirmar a solicitação';
    };

    if (!observation) {
        observation = 'Sem observações';
    };

    const connection = await getConnection();

    try {

        const { rows: [verifyRequestComplete] } = await connection.execute(requestCompleteQuery, [request], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        
        if (!verifyRequestComplete || verifyRequestComplete['SN_REALIZADO'] === 'S') {
            return 'Solicitação não encontrada ou já foi confirmada anteriormente';
        } else {
            const { rows: [checkEmployee]} = await connection.execute(checkEmployeeQuery, [employee], { outFormat: oracledb.OUT_FORMAT_OBJECT });

            if (!checkEmployee) {
                return 'Funcionário não encontrado';
            }

            try {
                const confirmationRequest = await connection.execute(confirmationRequestQuery, [employee, observation, request], { autoCommit: true });
                
                if (confirmationRequest.rowsAffected === 1) {
                    confirmationRequest.confirmationMessage = 'Solicitação de limpeza confirmada com sucesso';
                }

                return confirmationRequest.confirmationMessage;

            } catch (err) {
                return err;
            }

        }

    } catch(err) {
        return err;
    } finally {
        await connection.close();
    };
};

export async function refuseCleanRequestModel(request) {
    const connection = await getConnection();

    try {
        const { rows: [verifyRequest] } = await connection.execute(verifyRequestQuery, [request], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        
        if (!verifyRequest) {
            return 'Solicitação não encontrada';
        } else if (verifyRequest['DT_HR_INI_POS_HIGIENIZA'] !== null) {
            const { rowsAffected: refuseCleanRequest} = await connection.execute(refuseCleanRequestQuery, {request}, { autoCommit: true });
            
            if (refuseCleanRequest === 1) {
                return 'Solicitação de limpeza recusada com sucesso';
            }
        } else {
            return 'Solicitação não esta em estado de limpeza finalizada para recusa';
        }
    } catch(err) {
        return err;
    } finally {
        await connection.close();
    };
};

export async function checkListFormModel(params) {
    const connection  = await getConnection();

    Object.keys(params).forEach(key => {
        if (params[key] == null || params[key] == '' || !params[key]) {
            params[key] = 'N';
        }
    });

    if (params.assinatura == 'N' || params.assinatura == 'S') {
        params.assinatura = null;
    }

    if (params.solicLimp == 'N' || params.solicLimp == 'S') {
        params.solicLimp = null;
    }

    if (params.observacao == 'N' || params.observacao == 'S') {
        params.observacao = null;
    }

    try {
        
        const checkListForm = await connection.execute(checkListFormQuery, [
            params.solicLimp,
            params.tipo,
            params.userName, 
            params.leito, 
            params.tv, 
            params.cama, 
            params.travesseiro, 
            params.enxoval, 
            params.sofa, 
            params.poltrona, 
            params.escada, 
            params.toalha, 
            params.telefone, 
            params.observacao,
            params.cd_atendimento
        ], { autoCommit: true });

        return {
            message: 'Formulário de checklist inserido com sucesso'
        };
    } catch(err) {
        return err;
    } finally {
        await connection.close();
    };
};