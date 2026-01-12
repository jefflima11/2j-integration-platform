import { hospitalBedsStatusModel, cleaningRequestModel, waitingConfirmationModel, updateCleanRequestModel, confirmCleanRequestModel, refuseCleanRequestModel } from '../models/hospitalBedsModel.js';

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
        const waitingConfirmations = await waitingConfirmationModel();
        if (!waitingConfirmations) {
            res.status(200).json({ message: 'Não há solicitações aguardando confirmação' });
        }
        
        res.status(200).json({ waitingConfirmations });
        

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    };
};

export async function updateCleanRequestController(req, res) {
    const { request } = req.params;

    try {
        const updateCleaningRequest = await updateCleanRequestModel(request);

        if (updateCleaningRequest === 'Solicitação não encontrada') {
            return res.status(404).json({ message: updateCleaningRequest });
        } else {
            return res.status(200).json({ updateCleaningRequest });
        }
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    };
};

export async function confirmCleanRequestController(req, res) {
    const { request } = req.params;

    const { employee, observation } = req.body;

    try {
        const confirmCleaningRequest = await confirmCleanRequestModel(request, employee, observation);
        res.status(200).json({ confirmCleaningRequest });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    };
};

export async function refuseCleanRequestController(req, res) {
    const { request } = req.params;

    try {
        const refuseCleaningRequest = await refuseCleanRequestModel(request);
        res.status(200).json({ refuseCleaningRequest });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    };
};