import app from './app.js';

const PORT = process.env.PORT || 4020;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

process.on('SIGINT', async () => {
    console.log('Database connection closed. Exiting process.');
    process.exit(0);
});