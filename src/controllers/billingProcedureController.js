import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { unconfiguredProcedures } from '../models/billingProceduresModel.js'
import { importCache } from '../cache/importCache.js';
import { processData } from '../services/processData.js'

export async function importFileController(req, res, next) {

    try {
        const pathName = path.parse(req.file.originalname).name;

        const filePath = req.file.path;

        const workbook = XLSX.readFile(filePath);

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName]; 

        const data = XLSX.utils.sheet_to_json(worksheet);

        const tempFilePath = path.join(`temp/${pathName}(dados processados).json`);

        fs.writeFileSync(tempFilePath, JSON.stringify(data, null, 2));

        const cache = new Map();

        importCache.set("planilha",{
            fieldname: req.file.fieldname,
            originalname: path.parse(req.file.originalname).name
        });

        const execProcessData = await processData();

        res.status(200).send({ 
            message: 'Arquivo carregado e processo com sucesso!', 
            dataFile: req.file.originalname,
            recordsProcessed: data.length,
            retorno: execProcessData
        });


    } catch (err) {
        res.status(501).json({ error: err.message });
    }
}

export async function insertDataController(req, res) {
    //
}
