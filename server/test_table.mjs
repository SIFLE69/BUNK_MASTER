import fs from 'fs';
import { PDFParse } from 'pdf-parse';

const pdfPath = 'd:/vscod/web/chutti_pro/FE TT w.e.f. 06-03-2026.pdf';
const dataBuffer = fs.readFileSync(pdfPath);

const parser = new PDFParse({ data: dataBuffer });

parser.getTable().then(result => {
    console.log("Found", result.pages.length, "pages");
    if (result.pages.length > 0) {
        const tableArr = result.pages[0].tables;
        console.log("Found", tableArr.length, "tables on page 1");
        if (tableArr.length > 0) {
            const table = tableArr[0]; // array of arrays
            console.log("Table size:", table.length, "rows x", (table[0] ? table[0].length : 0), "cols");
            console.log("Header row (first 10 cells):", table[0].slice(0, 10));
        }
    }
    parser.destroy();
}).catch(err => {
    console.error(err);
});
