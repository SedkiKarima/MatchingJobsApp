const fs = require('fs/promises');
const path = require('path');
const logger = require('../utils/logger');

const { convertPdfToImages, PdfConversionError } = require('./pdfConverter');
const { encodeImagesToBase64, ImageEncodingError } = require('./imageEncoder');
const { extractResumeData, ResumeExtractionError } = require('./resumeExtractionService');
const { evaluateCandidate, CandidateEvaluationError } = require('./candidateEvaluationService');

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';

async function cleanupFiles(filePaths) {
    await Promise.all(
        filePaths.map(async (p) => {
            try {
                await fs.unlink(p);
            } catch (err) {
                logger.warn('Failed to clean up temp file', { path: p });
            }
        })
    );
}

/**
 * Full 12-step AI workflow as a plain service function.
 *
 * @param {string} pdfPath - path to the already-saved resume PDF on disk
 * @param {string} [jobDescription] - job description text (step 9, supplied
 *   by the caller, which is responsible for fetching it from MySQL). If
 *   omitted, only resume extraction runs and evaluation is skipped.
 * @returns {Promise<{ resume: object, evaluation: object|null }>}
 * @throws {PdfConversionError | ImageEncodingError | ResumeExtractionError | CandidateEvaluationError}
 *   on any failure — the caller is responsible for catching and mapping
 *   these to HTTP responses, logs, retries, etc.
 */
async function processResume(pdfPath, jobDescription) {
    if (!pdfPath) {
        throw new Error('pdfPath is required.');
    }

    const imageOutputDir = path.join(UPLOAD_DIR, 'images', path.basename(pdfPath, '.pdf'));
    let imagePaths = [];

    try {
        logger.info('PDF received', { pdfPath });

        // Steps 3-4: read the local PDF, convert every page into a PNG image
        imagePaths = await convertPdfToImages(pdfPath, imageOutputDir);

        // Step 5: convert every image into Base64
        const base64Images = await encodeImagesToBase64(imagePaths);

        // Steps 6-8: build + send the extraction request, get structured resume JSON
        const resumeData = await extractResumeData(base64Images);

        // Step 9: job description supplied by the caller (already fetched from MySQL)
        let evaluation = null;
        if (jobDescription) {
            // Steps 10-11: build + send the evaluation request, apply decision rules
            evaluation = await evaluateCandidate(resumeData, jobDescription);
        } else {
            logger.warn('No job description provided; skipping evaluation step');
        }

        // Step 12: return the final result. This module does NOT write to MySQL.
        return { resume: resumeData, evaluation };
    } finally {
        await cleanupFiles(imagePaths);
    }
}

module.exports = processResume;