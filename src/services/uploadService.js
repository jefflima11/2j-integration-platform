import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function(req, file, cb) {
        if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.mimetype === 'application/vnd.ms-excel') {
            cb(null, true);
        } else {
            cb(new Error('Only Excel files are allowed!'), false);
        }
    }
});

async function start() {
    const uploadsDir = path.resolve('./src/uploads/');

    await fs.mkdir(uploadsDir, { recursive: true })

    try {

        const entries = await fs.readdir(uploadsDir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(uploadsDir, entry.name);

            if (entry.isDirectory()) {
                await fs.rm(fullPath, { recursive: true, force: true });
            } else {
                await fs.unlink(fullPath);
            }
        }

        console.log(`Limpeza de arquivos temporarios concluída.`);
    } catch (err) {
        console.error(`Erro ao limpar arquivos temporarios: ${err.message}`);
    }
}

export { upload, start };