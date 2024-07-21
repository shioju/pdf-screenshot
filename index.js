import fs from 'node:fs';
import path from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
// import { createCanvas } from 'canvas';
// Comment out this in pdf.mjs ---> // this.ctx.drawImage(groupCtx.canvas, 0, 0);
// import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import pdfjsLib from '@frozenick/pdfjs-canvas-free/build/pdf.js'; 

async function convertPdfToPng(pdfPath) {
    const pdfData = await pdfjsLib.getDocument(pdfPath).promise;

    for (let i = 0; i < pdfData.numPages; i++) {
        const page = await pdfData.getPage(i + 1);
        const viewport = page.getViewport({ scale: 1.0 });
        const canvas = createCanvas(viewport.width, viewport.height);
        const ctx = canvas.getContext('2d');

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };

        await page.render(renderContext).promise;
        const pngPath = path.join(path.dirname(pdfPath), `${path.basename(pdfPath, path.extname(pdfPath))}_page${i + 1}.png`);
        // const out = fs.createWriteStream(pngPath);
        // const stream = canvas.createPNGStream();
        // stream.pipe(out);

        const pngData = await canvas.encode('png') // JPEG, AVIF and WebP are also supported
        // encoding in libuv thread pool, non-blocking
        await fs.promises.writeFile(pngPath, pngData)
    }
}
convertPdfToPng('example.pdf');

