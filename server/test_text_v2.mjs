import fs from 'fs';
import { PDFParse } from 'pdf-parse';

const pdfPath = 'd:/vscod/web/chutti_pro/FE TT w.e.f. 06-03-2026.pdf';
const dataBuffer = fs.readFileSync(pdfPath);

const parser = new PDFParse({ data: dataBuffer });

parser.getText({ lineEnforce: true, itemJoiner: ' ' }).then(result => {
    console.log("=== RAW TEXT DUMP (ENFORCED) ===");
    console.log(result.text);
    console.log("=== RAW TEXT END ===");
    parser.destroy();
}).catch(err => {
    console.error(err);
});
