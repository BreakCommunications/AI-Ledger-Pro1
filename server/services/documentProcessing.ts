import { PDFDocument } from 'pdf-lib';
import { createWorker } from 'tesseract.js';
import fs from 'fs/promises';
import path from 'path';

export const extractTextFromPDF = async (filePath: string): Promise<string> => {
  const pdfBytes = await fs.readFile(filePath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  let text = '';

  for (let i = 0; i < pdfDoc.getPageCount(); i++) {
    const page = pdfDoc.getPage(i);
    const { width, height } = page.getSize();
    const textContent = await page.getTextContent();
    text += textContent.items.map((item: any) => item.str).join(' ');
  }

  return text;
};

export const extractTextFromImage = async (filePath: string): Promise<string> => {
  const worker = await createWorker();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const { data: { text } } = await worker.recognize(filePath);
  await worker.terminate();
  return text;
};

export const processDocument = async (filePath: string): Promise<string> => {
  const fileExtension = path.extname(filePath).toLowerCase();

  switch (fileExtension) {
    case '.pdf':
      return extractTextFromPDF(filePath);
    case '.jpg':
    case '.jpeg':
    case '.png':
      return extractTextFromImage(filePath);
    default:
      throw new Error('Unsupported file format');
  }
};