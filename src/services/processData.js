import fs from 'fs';
import { importCache } from '../cache/importCache.js';
import { validProcedures } from '../models/billingProceduresModel.js';

export async function processData() {

    try {
        const cache = importCache.get("planilha");

        let rawData

        console.log('')
        console.log('##################################')
        console.log('Lendo dados...');
        try {
            rawData = fs.readFileSync(`temp/${cache.originalname}(dados processados).json`, 'utf-8');
        } catch (err) {
            throw new Error(`Erro ao tentar ler 'temp/${cache.originalname}(dados processados).json': ${err}`);
        };

        const data = JSON.parse(rawData);

        console.log('Alterando dados...')
        data.forEach(item => {
            item.tiss = item["Código"];
            item.valor = item["Preço Máximo Intercâmbio Nacional"];
            item.brasindice = item["Cod TISS Brasindice"];

            
            const colunasParaManter = ["tiss", "valor", "brasindice"];
            
            Object.keys(item).forEach(coluna => {
                if (!colunasParaManter.includes(coluna)) {
                    delete item[coluna];
                }
            });
            
            if (item.brasindice == 'NAO POSSUI BRASINDICE') {
                item.brasindice = 'N/A';
            }
            
            item.valor = Number(String(item.valor).replace(",", "."));
            
        });

        console.log('Filtrando dados zerados...');
        const valoresZero = data.filter(item => item.valor === 0);
        
        console.log('Filtrando dados sem Brasindice...');
        const semBrasindice = data.filter(item => item.brasindice === 'N/A');

        console.log('Filtrando dados válidos...');
        const validos = data.filter(item => (item.valor != 0 && item.brasindice != 'N/A'));

        console.log('Inserindo em tabela de de-para...');
        const unconfiguredProcedures =  await validProcedures(validos);
        
        console.log('Dados filtrados com sucesso');
        const dataAnalitics = { 
            SemBrasindice: semBrasindice.length,
            zerados: valoresZero.length,
            semDePara: unconfiguredProcedures.rows.length,
            validos: validos.length
        };  
        
        console.log('Processamento concluído.');
        console.log('##################################')
        console.log('');

        return dataAnalitics;

    } catch (err) {
        return { processData: err };
    };
};