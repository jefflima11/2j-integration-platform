import app from './app.js';
import fs from 'fs';

const PORT = process.env.PORT || 4020;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`);
});

try {
    let rawData;
    rawData = fs.readFileSync('', 'utf-8');

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

    console.log('Resultado:', semBrasindice);

} catch (err) {
    console.log('erro no tratamento: ', err);
}
process.on('SIGINT', async () => {
    console.log('Banco de dados desconectado com sucesso!');
    process.exit(0);
});