import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { upload } from '../services/uploadService.js';
import { unconfiguredProcedures } from '../models/proceduresData.js'

export async function uploadFile(req, res) {
    
    try {
        upload.single('file')(req, res, (err) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }

            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const filePath = req.file.path;

            const workbook = XLSX.readFile(filePath);
            
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName]; 

            const data = XLSX.utils.sheet_to_json(worksheet);

            const tempFilePath = path.join('./src/temp/data.json');

            fs.writeFileSync(tempFilePath, JSON.stringify(data, null, 2));

            res.status(200).send({ 
                message: 'Arquivo carregado e processo com sucesso!', 
                dataFile: req.file.originalname,
                recordsProcessed: data.length
            });
        });
        
      
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function processData(req, res) {
    try {
        let rawData

        try {
            rawData = fs.readFileSync('./src/temp/data.json', 'utf-8');
        } catch (err) {
            throw new Error(`Erro ao tentar ler '/temp/data.json': ${err}`);
        };

        const data = JSON.parse(rawData);

        const processedData = await cleaningDatas(data);

        try {
            return processedData;
        } catch (err) {
            throw new Error(`Erro, Erro: ${err}`);
        };

    } catch (err) {
        throw new Error('Erro no processamento dos dados')
    };
    
    // try {
    //     const unconfigured = await unconfiguredProcedures();
    //     res.status(200).json({ message: err });
    // } catch (err) {;
    //     res.status(500).json({ message: err })
    // }
}
