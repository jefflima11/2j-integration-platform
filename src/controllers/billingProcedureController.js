import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { confirmProcedures, deleteCompetence } from '../models/billingProceduresModel.js'
import { importCache } from '../cache/importCache.js';
import { importMedicamentos,  } from '../services/processData.js'
import { importMateriais } from '../services/importMateriais.js'

export async function importFileController(req, res, next) {

    try {
        const pathName = path.parse(req.file.originalname).name;

        let tableType;
        if (pathName.toLowerCase().includes('med')) {
            tableType = 'med'
        } else if (pathName.toLowerCase().includes('mat')) {
            tableType = 'mat';
        } else {
            res.status(400).json({ message: 'Planilha não aceita. Carregue uma planilha de materiais ou medicamentos, ou renomeie a planilha conforme a atualização desejada'});
            return;
        };

        const filePath = req.file.path;

        let importedData;

        let data;

        if (tableType === 'med') {

            const workbook = XLSX.readFile(filePath);
    
            const firstSheetName = workbook.SheetNames[0];
    
            const worksheet = workbook.Sheets[firstSheetName]; 
            
            data = XLSX.utils.sheet_to_json(worksheet);
    
            if (!data || data.length === 0) {
                return res.status(400).json({ error: 'O arquivo Excel está vazio, não contém dados ou está em modo de leitura.' });
            }
    
            const tempFilePath = path.join(`temp/${pathName}(dados processados).json`);
    
            fs.writeFileSync(tempFilePath, JSON.stringify(data, null, 2));
    
            const cache = new Map();
    
            importCache.set("planilha",{
                fieldname: req.file.fieldname,
                originalname: path.parse(req.file.originalname).name
            });

            importedData = await importMedicamentos();

            res.status(200).send({ 
                message: 'Arquivo carregado e processo com sucesso!', 
                dataFile: req.file.originalname,
                recordsProcessed: data.length,
                retorno: importedData
            });

        } else {
            const total = await importMateriais(filePath);
            return res.status(409).json({
                message: "Função de processamento de tabela de materiais ainda não concluida, peço desculpas.",
                total
            })
        }




    } catch (err) {
        res.status(501).json({ 
            Local: "importFileController()",
            Erro: err.message 
        });
    }
}

export async function insertDataController(req, res) {
    try {
        const confirmProceduresResult = await confirmProcedures();

        if (confirmProceduresResult.code === 200) {
            res.status(confirmProceduresResult.code).json({ 
                message: confirmProceduresResult.msg,
                data: `${confirmProceduresResult.qtd} registros importados.`
            });
        };

        if (confirmProceduresResult.code === 409) { 
            res.status(confirmProceduresResult.code).json({
                message: confirmProceduresResult.msg
            });
        };

    } catch (err) {
        res.status(500).json({ 
            Error: err.message,
            Local: 'insertDataController()'
        });
    };
};

export async function deleteCompetenceController(req, res) {
    // 
};

export async function deleteLastCompetenceController(req, res) {
    try {
        const competenceDeleted = await deleteCompetence();

        res.status(competenceDeleted.code).json({ message: competenceDeleted.msg });
    } catch (err) {
        res.status(competenceDeleted.code).json({ message: competenceDeleted.msg });
    };
};