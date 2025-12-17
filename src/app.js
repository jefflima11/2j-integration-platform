import express from 'express';
import routes from './routes/index.js';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: '192.168.10.36:5173'
}));

app.use(express.json());

app.use(routes);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        error: {
            message: err.message || "Internal Server Error",
        },
    });
});

export default app;