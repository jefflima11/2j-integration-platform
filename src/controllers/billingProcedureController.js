import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { unconfiguredProcedures } from '../models/billingProceduresModel.js'
import { importCache } from '../cache/importCache.js';

export async function importFileController(req, res) {

    try {
        const pathName = path.parse(req.file.originalname).name;

        const filePath = req.file.path;

        const workbook = XLSX.readFile(filePath);
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName]; 

        const data = XLSX.utils.sheet_to_json(worksheet);

        const tempFilePath = path.join(`./src/temp/${pathName}(dados processados).json`);

        fs.writeFileSync(tempFilePath, JSON.stringify(data, null, 2));

        const cache = new Map();

        importCache.set("planilha",{
            fieldname: req.file.fieldname,
            originalname: path.parse(req.file.originalname).name
        });

        return res.status(200).send({ 
            message: 'Arquivo carregado e processo com sucesso!', 
            dataFile: req.file.originalname,
            recordsProcessed: data.length
        });
        
              
    } catch (err) {
        res.status(501).json({ error: err.message });
    }
}

export async function processDataController(req, res) {

    try {
        const cache = importCache.get("planilha");
        // console.log({ cache });
        let rawData

        try {
            rawData = fs.readFileSync(`./src/temp/${cache.originalname}(dados processados).json`, 'utf-8');
        } catch (err) {
            throw new Error(`Erro ao tentar ler '/temp/${cache.originalname}(dados processados).json': ${err}`);
        };

        const data = JSON.parse(rawData);

        console.log({ data });

        const newData = data.map(({ tiss }) => ({
            'Código': tiss
        }));

        return res.status(200).json(newData);

        // const processedData = await cleaningDatas(data);

        // try {
        //     return processedData;
        // } catch (err) {
        //     throw new Error(`Erro, Erro: ${err}`);
        // };

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

export async function insertDataController(req, res) {
    //
}
