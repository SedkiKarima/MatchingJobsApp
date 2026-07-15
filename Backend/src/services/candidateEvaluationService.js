const OpenAI = require('openai');
const logger = require('../utils/logger');
const { buildCandidateEvaluationPrompt } = require('./promptBuilder');

class CandidateEvaluationError extends Error {
  constructor(message, code = 'CANDIDATE_EVALUATION_ERROR') {
    super(message);
    this.name = 'CandidateEvaluationError';
    this.code = code;
  }
}

const REQUIRED_FIELDS = [
  'score', 'matchedSkills', 'missingSkills', 'strengths',
  'weaknesses', 'summary', 'recommendation', 'decision', 'status',
];

function getClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL || undefined,
    timeout: Number(process.env.OPENAI_REQUEST_TIMEOUT_MS) || 60000,
    maxRetries: Number(process.env.OPENAI_MAX_RETRIES) || 2,
  });
}

function parseModelJson(rawText) {
  let cleaned = rawText.trim();
  cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '');

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new CandidateEvaluationError('Model did not return valid JSON for candidate evaluation.', 'INVALID_JSON');
  }

  for (const field of REQUIRED_FIELDS) {
    if (!(field in parsed)) {
      throw new CandidateEvaluationError(`Evaluation JSON missing required field: ${field}`, 'INVALID_SCHEMA');
    }
  }

  return parsed;
}

/**
 * Fixed decision rules from the spec. This ALWAYS overrides whatever
 * decision/status/recommendation the model guessed, so the business logic
 * never depends on the model getting arithmetic right.
 */
function applyDecisionRules(evaluation) {
  const score = Number(evaluation.score);

  if (Number.isNaN(score)) {
    throw new CandidateEvaluationError('Evaluation score is not a valid number.', 'INVALID_SCORE');
  }

  const clampedScore = Math.max(0, Math.min(100, score));
  let decision;
  let status;
  let recommendation;

  if (clampedScore >= 80) {
    decision = true;
    status = 'Approved';
    recommendation = 'Highly Recommended';
  } else if (clampedScore >= 60) {
    decision = true;
    status = 'Consider';
    recommendation = 'Recommended';
  } else {
    decision = false;
    status = 'Rejected';
    recommendation = 'Not Recommended';
  }

  return {
    ...evaluation,
    score: clampedScore,
    decision,
    status,
    recommendation,
  };
}

/**
 * Steps 10-11: sends the extracted resume JSON + job description to
 * GPT-4o mini, validates the returned JSON, then applies the fixed
 * decision rules to guarantee consistent status/decision/recommendation.
 */
async function evaluateCandidate(resumeJson, jobDescription) {
  if (!jobDescription || typeof jobDescription !== 'string' || !jobDescription.trim()) {
    throw new CandidateEvaluationError('Job description is missing or empty.', 'MISSING_JOB_DESCRIPTION');
  }

  const client = getClient();
  const prompt = buildCandidateEvaluationPrompt(resumeJson, jobDescription);

  let response;
  try {
    response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0,
      response_format: { type: 'json_object' },
    });
  } catch (err) {
    logger.error('OpenAI candidate evaluation request failed', { message: err.message });
    throw new CandidateEvaluationError(`OpenAI API error during candidate evaluation: ${err.message}`, 'OPENAI_ERROR');
  }

  const rawText = response?.choices?.[0]?.message?.content;
  if (!rawText) {
    throw new CandidateEvaluationError('Empty response from model during candidate evaluation.', 'EMPTY_RESPONSE');
  }

  const parsed = parseModelJson(rawText);
  const finalResult = applyDecisionRules(parsed);

  logger.info('Job evaluation completed', { score: finalResult.score, status: finalResult.status });
  return finalResult;
}

module.exports = { evaluateCandidate, CandidateEvaluationError };