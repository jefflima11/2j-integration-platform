export function authorize(roles = []) {
    if (typeof roles === "string") {
        roles = [roles];
    }

    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Usuario não atenticado" });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Acesso negado: permissão insuficiente" });
        }

        next();
    }

};