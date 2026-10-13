import ExcelJS from 'exceljs';

export async function importMateriais(filePath) {
    const workbookReader = new ExcelJS.stream.xlsx.WorkbookReader(filePath, {
        worksheets: 'emit',
        sharedStrings: 'cache',
        hyperlinks: 'ignore',
        styles: 'ignore'
    });

    let headers = [];
    let total = 0;
    const registro = {};

    for await (const worksheetReader of workbookReader) {
        for await (const row of worksheetReader) {

            const values = row.values;

            if (row.number === 1) {
                headers = values;
                continue;
            }


            headers.forEach((header, index) => {
                if (header) {
                    registro[header] = values[index] ?? '';
                }
            });

            total++;

            registro.tuss = registro["Código"];
            registro.valor = registro["Valor Máximo Intercâmbio Nacional"];
            registro.tiss = registro["TISS Código do Material"];
            registro.simpro = registro["Cod Simpro"];

            const colunasParaManter = ["tuss", "valor", "tiss", "simpro"];

            Object.keys(registro).forEach(coluna => {
                if (!colunasParaManter.includes(coluna)) {
                    delete registro[coluna];
                }
            })

            registro.valor = Number(String(registro.valor).replace(",","."));


            if (total <= 100) {
                console.log(registro);
                return;
            }
        

            console.log("Em processamento..")
        }
    }
    
    if (registro) {
        console.log("Variavel existe fora do escopo.")
    };

    const zeroValues = registro.filter(item => item.valor === 0);
    console.log({
        "Valores zerados": zeroValues
    });

    return total;
}