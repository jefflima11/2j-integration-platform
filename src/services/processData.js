import fs from 'fs';
import { importCache } from '../cache/importCache.js';

export async function processData() {

    try {
        const cache = importCache.get("planilha");

        let rawData

        try {
            rawData = fs.readFileSync(`./src/temp/${cache.originalname}(dados processados).json`, 'utf-8');
        } catch (err) {
            throw new Error(`Erro ao tentar ler '/temp/${cache.originalname}(dados processados).json': ${err}`);
        };

        const data = JSON.parse(rawData);

        const nomeColunas = Object.keys(data[0]);

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

            item.valor = Number(item.valor.replace(",","."));
            
        });

        const valoresZero = data.filter(item => item.valor === 0);

        const semBrasindice = data.filter(item => item.brasindice === 'N/A');

        const validos = data.filter(item => (item.valor != 0 && item.brasindice != 'N/A'));

        const dataAnalitics = { 
            SemBrasindice: semBrasindice.length,
            zerados: valoresZero.length,
            semDePara: null,
            validos: validos.length
        };

        return dataAnalitics;

    } catch (err) {
        return err;
    };
};