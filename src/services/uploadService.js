import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';
import { createFolders } from '../utils/createTemporaryFolders.js'
import config from '../config/build-config.js'

const uploadPath = path.join('..', config.folder, 'uploads');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // cb(null, uploadPath);
        cb(null, path.join('./uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

export const upload = multer({ 
    storage: storage,
    fileFilter: function(req, file, cb) {
        if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.mimetype === 'application/vnd.ms-excel') {
            cb(null, true);
        } else {
            cb(new Error('Only Excel files are allowed!'), false);
        }
    }
});

export const uploadSignature = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Only JPEG and PNG files are allowed!'), false);
        }
    }
});

export async function cleanTemporaryFolders() {

    const { uploadsDir, tempDir} = await createFolders();

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

    } catch (err) {
        console.log({ uploadsDir: err });
    };

    try {
        const entries = await fs.readdir(tempDir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(tempDir, entry.name);

            if (entry.isDirectory()) {
                await fs.rm(fullPath, { recursive: true, force: true });
            } else {
                await fs.unlink(fullPath);
            }
        }

        // next()
    } catch (err) {
        console.log({ tempDir: err });
    }
};