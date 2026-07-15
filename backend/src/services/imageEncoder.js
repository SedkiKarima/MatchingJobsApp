const fs = require('fs/promises');
const logger = require('../utils/logger');

class ImageEncodingError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ImageEncodingError';
  }
}

/**
 * Reads each PNG page from disk and converts it into a base64 data URL
 * ready to be sent to GPT-4o mini as image input.
 */
async function encodeImagesToBase64(imagePaths) {
  const encoded = [];

  for (const imagePath of imagePaths) {
    try {
      const buffer = await fs.readFile(imagePath);
      if (!buffer || buffer.length === 0) {
        throw new Error('Image file is empty');
      }
      encoded.push(`data:image/png;base64,${buffer.toString('base64')}`);
    } catch (err) {
      throw new ImageEncodingError(`Failed to encode image at ${imagePath}: ${err.message}`);
    }
  }

  logger.info('Images encoded to Base64', { count: encoded.length });
  return encoded;
}

module.exports = { encodeImagesToBase64, ImageEncodingError };