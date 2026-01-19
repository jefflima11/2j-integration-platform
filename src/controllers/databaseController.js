import { setDbConfig } from '../database/configuration.js';

async function databaseController(req, res) {
    const { userDB, passwordDB, connectDB, dirDB, secretKeyDB } = req.body;

    try {
        setDbConfig({ userDB, passwordDB, connectDB, dirDB, secretKeyDB });
        
        res.status(201).json({ message: 'Dados guardados!'})
    } catch (err) {
        res.status(500).json({ message: 'Erro interno do servidor: ' + err});
    }
}

export {
    databaseController
}