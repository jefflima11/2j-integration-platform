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

    for await (const worksheetReader of workbookReader) {
        for await (const row of worksheetReader) {

            const values = row.values;

            if (row.number === 1) {
                headers = values;
                // console.log('Cabeçalhos:', headers);
                continue;
            }

            const registro = {};

            headers.forEach((header, index) => {
                if (header) {
                    registro[header] = values[index] ?? '';
                }
            });

            total++;

            // registro.forEach(item => {
            //     item.tiss = item["Código"];

            //     const colunasParaManter = ["tiss"];

            //     Object.keys(item).forEach(coluna => {
            //         if(!colunasParaManter.includes(coluna)) {
            //             delete item[coluna];
            //         }
            //     });
                
            // });

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


            // if (total <= 1) {
            //     console.log(registro);
            // }

            // console.log(registro);

            const zeroValues = registro.filter(item => item.valor === 0);



        }
    }

    return total;
}