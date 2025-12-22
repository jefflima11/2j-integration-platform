import { getConnection } from '../database/connection.js';
import oracledb from 'oracledb';
import { hospitalBedsStatusQuery, cleaningRequestQuery, waitingConfirmationQuery } from '../queries/hospitalBedsQueries.js';

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
        const {rows: cleaningRequests} = await connection.execute(waitingConfirmationQuery, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
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

export async function cleanRequestModel({ id }) {
    const connection = await getConnection();

    try {
        const {rows: cleaningRequest} = await connection.execute(cleaningRequestQuery, [id], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        return cleaningRequest;
    } catch(err) {
        return err;
    } finally {
        await connection.close();
    };
};