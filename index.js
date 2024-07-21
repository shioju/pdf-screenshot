import fs from 'node:fs'; // ESM import for fs
import path from 'node:path'; // ESM import for path
import { createCanvas } from '@napi-rs/canvas'; // ESM import for canvas
// import { createCanvas } from 'canvas'; // ESM import for canvas
// import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'; // ESM import for pdfjs-dist
import pdfjsLib from '@frozenick/pdfjs-canvas-free/legacy/build/pdf.js'; 

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

        await page.render(renderContext).promise; // Ensure to await the render
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

