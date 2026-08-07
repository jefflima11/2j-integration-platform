import app from './app.js';
import config from "./config/build-config.js";
import { cleanTemporaryFolders } from './services/uploadService.js';

const PORT = config.port;

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log("=================================");
    console.log(`2J System API`);
    console.log(`Ambiente : ${config.environment}`);
    console.log(`Versão   : ${config.version}`);
    console.log(`Serviço  : ${config.service}`);
    console.log(`Porta    : ${config.port}`);
    console.log("=================================");
    cleanTemporaryFolders();
});

server.on('error', (error) => {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
});

function encerrar() {
    console.log('Encerrando API...');
    server.close(() => process.exit(0));
}

process.on('SIGINT', encerrar);
process.on('SIGTERM', encerrar);