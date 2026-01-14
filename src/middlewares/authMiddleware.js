import jwt from "jsonwebtoken";
import { getDbConfig } from '../database/configuration.js';

export function authMiddleware(req, res, next) {
    const config = getDbConfig();

    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ message: "Token não fornecido" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token inválido" });

    try {
        const decoded = jwt.verify(token, config.secretKeyDB);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Token inválido ou expirado" });
    }
}