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
                console.log('Cabeçalhos:', headers);
                continue;
            }

            const registro = {};

            headers.forEach((header, index) => {
                if (header) {
                    registro[header] = values[index] ?? '';
                }
            });

            total++;

            if (total <= 3) {
                console.log(registro);
            }
        }
    }

    return total;
}