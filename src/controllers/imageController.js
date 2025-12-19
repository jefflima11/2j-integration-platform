import path from 'path';

export function imageLogo(req, res) {
    try {
        const imgPath = path.join(process.cwd(), 'src/img/logo.png');
        res.sendFile(imgPath);
    } catch (err) {
        res.status(404).json(`Imagem não encontrada: ${err}`);
    };
};