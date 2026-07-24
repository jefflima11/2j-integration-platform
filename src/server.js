import app from './app.js';

const PORT = process.env.PORT || 4020;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta: ${PORT}`);
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