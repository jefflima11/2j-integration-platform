import app from './app.js';
import { initDB, closeDB } from './database/connection.js';

const PORT = process.env.PORT || 4010;

app.listen(PORT, async () => {
    await initDB();
    console.log(`Server is running on port ${PORT}`);
});

process.on('SIGINT', async () => {
    await closeDB();
    console.log('Database connection closed. Exiting process.');
    process.exit(0);
});