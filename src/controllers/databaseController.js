import { setDbConfig } from '../database/configuration.js';
import { createPool } from '../database/connection.js';
import { verifica_tabelas } from '../services/tableServices.js';

async function databaseController(req, res) {
    const { userDB, passwordDB, connectDB, dirDB, secretKeyDB } = req.body;

    try {
        const config = { userDB, passwordDB, connectDB, dirDB, secretKeyDB };

        setDbConfig({ userDB, passwordDB, connectDB, dirDB, secretKeyDB });
        
        await createPool(config);
        await verifica_tabelas();

        res.status(201).json({ 
            message: 'Banco configurado e pool criado com sucesso'
        });
    } catch (err) {
        res.status(500).json({ 
            message: 'Erro ao configurar banco de dados'
        });
    }
}

export {
    databaseController
}