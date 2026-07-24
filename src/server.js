import app from './app.js';
import fs from 'fs';

const PORT = process.env.PORT || 4020;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`);
});

process.on('SIGINT', async () => {
    console.log('Banco de dados desconectado com sucesso!');
    process.exit(0);
});