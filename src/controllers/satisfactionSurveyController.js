import { patientInfo } from '../models/satisfactionSurveyModel.js';

export async function getPatientInfo(req, res) {
    const { cdPatient } = req.params;

    try {
        const info = await patientInfo(parseInt(cdPatient));

        if (!info) {
            return res.status(404).json({ message: 'Paciente não encontrado' });
        }

        res.status(200).json(info);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao retornar informações do paciente' });
    };
}
