import { patientInfo, infoAllPatients } from '../models/satisfactionSurveyModel.js';

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

export async function getAllPatients(req, res) {

    try {
        const r = await infoAllPatients();

        res.status(r.code).json(
            r.msg
        )
    } catch (err) {
        res.status(500).json(
            'Erro no controlador'
        )
    }
}
