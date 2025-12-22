import { hospitalBedsStatusModel, cleaningRequestModel, waitingConfirmationModel, cleanRequestModel } from '../models/hospitalBedsModel.js';

export async function hospitalBedsStatusController(req, res) {
    try {
        const status = await hospitalBedsStatusModel();
        res.status(200).json(status);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    };
};

export async function cleaningRequestController(req, res) {
    try {
        const cleaningRequests = await cleaningRequestModel();
        res.status(200).json({ cleaningRequests });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    };
};

export async function waitingConfirmationController(req, res) {
    try {
        const waitingConfirmations = await waitingConfirmationModel({ status: 'waiting_confirmation' });
        res.status(200).json({ waitingConfirmations });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    };
};

export async function cleanRequestController(req, res) {
    const { request } = req.params;

    try {
        const cleaningRequest = await cleanRequestModel({ id: request });
        res.status(200).json({ cleaningRequest });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    };
};