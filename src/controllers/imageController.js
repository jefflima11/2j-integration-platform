import path from 'path';
import fs from 'fs';

export function imageLogo(req, res) {
    try {
        const imgPath = path.join(process.cwd(), 'src/img/logo.png');
        
        if (!fs.existsSync(imgPath)) {
            return res.status(404).json('Imagem não encontrada');
        }

        res.sendFile(imgPath);
    } catch (err) {
        res.status(404).json(`Imagem não encontrada: ${err}`);
    };
};