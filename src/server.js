import app from './app.js';
import { initDB, closeDB } from './database/connection.js';
import { verifica_tabelas } from './services/tableServices.js'
import { start } from './services/uploadService.js'

const PORT = process.env.PORT || 4020;

app.listen(PORT, async () => {
    await initDB();
    await verifica_tabelas();
    await start();
    console.log(`Server is running on port ${PORT}`);
});

process.on('SIGINT', async () => {
    await closeDB();
    console.log('Database connection closed. Exiting process.');
    process.exit(0);
});