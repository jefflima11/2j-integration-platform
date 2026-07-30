import fs from 'fs/promises';
import path from 'path';
    
export async function createFolders() {
    const uploadsDir = path.resolve('./uploads');
    const tempDir = path.resolve('./temp');

    await fs.mkdir(uploadsDir, { recursive: true });
    await fs.mkdir(tempDir, { recursive: true });

    return {uploadsDir, tempDir};
};