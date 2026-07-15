const fs = require('fs/promises');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const { pdfToPng } = require('pdf-to-png-converter');
const logger = require('../utils/logger');

class PdfConversionError extends Error {
  constructor(message, code = 'PDF_CONVERSION_ERROR') {
    super(message);
    this.name = 'PdfConversionError';
    this.code = code;
  }
}

async function validatePdf(pdfPath) {
  let bytes;
  try {
    bytes = await fs.readFile(pdfPath);
  } catch (err) {
    throw new PdfConversionError('Uploaded PDF could not be read from disk.', 'PDF_READ_FAILED');
  }

  if (!bytes || bytes.length === 0) {
    throw new PdfConversionError('Uploaded PDF is empty.', 'PDF_EMPTY');
  }

  let pdfDoc;
  try {
    pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  } catch (err) {
    throw new PdfConversionError('Uploaded PDF is corrupted or not a valid PDF.', 'PDF_CORRUPTED');
  }

  const pageCount = pdfDoc.getPageCount();
  if (pageCount === 0) {
    throw new PdfConversionError('Uploaded PDF has no pages.', 'PDF_NO_PAGES');
  }

  return { pageCount };
}

async function convertPdfToImages(pdfPath, outputDir) {
  const { pageCount } = await validatePdf(pdfPath);
  logger.info('PDF validated', { pageCount });

  await fs.mkdir(outputDir, { recursive: true });

  const baseName = path.basename(pdfPath, path.extname(pdfPath));

  let pngPages;
  try {
    pngPages = await pdfToPng(pdfPath, {
      viewportScale: 2.0,
      outputFolder: outputDir,
      outputFileMaskFunc: (pageNumber) => `${baseName}-page-${pageNumber}.png`,
      verbosityLevel: 0,
    });
  } catch (err) {
    throw new PdfConversionError(
      `Image conversion failed: ${err.message}`,
      'IMAGE_CONVERSION_FAILED'
    );
  }

  if (!pngPages || pngPages.length === 0) {
    throw new PdfConversionError('No pages were produced during image conversion.', 'PAGE_CONVERSION_FAILED');
  }

  const imagePaths = pngPages.map((p) => p.path);
  logger.info('PDF converted to images', { pages: imagePaths.length });
  return imagePaths;
}

module.exports = { convertPdfToImages, validatePdf, PdfConversionError };