const OpenAI = require('openai');
const logger = require('../utils/logger');
const { buildResumeExtractionPrompt } = require('./promptBuilder');

class ResumeExtractionError extends Error {
  constructor(message, code = 'RESUME_EXTRACTION_ERROR') {
    super(message);
    this.name = 'ResumeExtractionError';
    this.code = code;
  }
}

const REQUIRED_FIELDS = [
  'candidateName', 'email', 'phone', 'technicalSkills',
  'softSkills', 'experience', 'education', 'projects', 'certifications',
];

/**
 * OPENAI_BASE_URL lets this same client point at either:
 * - OpenAI directly (leave blank)
 * - GitHub Models: https://models.github.ai/inference (OpenAI-compatible)
 */
function getClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL || undefined,
    timeout: Number(process.env.OPENAI_REQUEST_TIMEOUT_MS) || 60000,
    maxRetries: Number(process.env.OPENAI_MAX_RETRIES) || 2,
  });
}

function parseAndValidateJson(rawText) {
  let cleaned = rawText.trim();
  cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '');

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new ResumeExtractionError('Model did not return valid JSON for resume extraction.', 'INVALID_JSON');
  }

  for (const field of REQUIRED_FIELDS) {
    if (!(field in parsed)) {
      throw new ResumeExtractionError(`Resume extraction JSON missing required field: ${field}`, 'INVALID_SCHEMA');
    }
  }

  return parsed;
}

/**
 * Steps 6-8: sends the base64 resume page images + extraction prompt to
 * GPT-4o mini and returns validated structured resume JSON only.
 * No evaluation happens here.
 */
async function extractResumeData(base64Images) {
  const client = getClient();
  const prompt = buildResumeExtractionPrompt();

  const imageContent = base64Images.map((img) => ({
    type: 'image_url',
    image_url: { url: img },
  }));

  let response;
  try {
    response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        {
          role: 'user',
          content: imageContent,
        },
      ],
      temperature: 0,
      response_format: { type: 'json_object' },
    });
  } catch (err) {
    logger.error('OpenAI resume extraction request failed', { message: err.message });
    throw new ResumeExtractionError(`OpenAI API error during resume extraction: ${err.message}`, 'OPENAI_ERROR');
  }

  const rawText = response?.choices?.[0]?.message?.content;
  if (!rawText) {
    throw new ResumeExtractionError('Empty response from model during resume extraction.', 'EMPTY_RESPONSE');
  }

  const parsed = parseAndValidateJson(rawText);
  logger.info('Resume extraction completed and validated');
  return parsed;
}

module.exports = { extractResumeData, ResumeExtractionError };