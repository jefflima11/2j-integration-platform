import app from './app.js';
import { closeDB } from './database/connection.js';
import { start } from './services/uploadService.js'

const PORT = 4020;

app.listen(PORT, async () => {
    await start();
    console.log(`Server is running on port ${PORT}`);
});

process.on('SIGINT', async () => {
    await closeDB();
    console.log('Database connection closed. Exiting process.');
    process.exit(0);
});