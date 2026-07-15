/**
 * Step 6: Resume Extraction Prompt.
 * This prompt ONLY extracts structured facts from the resume images.
 * It must never evaluate, score, or recommend anything.
 */
function buildResumeExtractionPrompt() {
  return `You are a resume parsing engine. You will be shown one or more images of a candidate's resume.

Extract ONLY the factual information present in the resume. Do NOT evaluate, score, rank, or comment on the candidate's fit for any role. Do NOT infer information that is not explicitly present.

Return ONLY valid JSON with exactly this shape, no markdown, no code fences, no extra text:

{
  "candidateName": "",
  "email": "",
  "phone": "",
  "technicalSkills": [],
  "softSkills": [],
  "experience": [],
  "education": [],
  "projects": [],
  "certifications": []
}

Rules:
- If a field cannot be found, use an empty string "" or empty array [] as appropriate.
- "experience" entries should be short strings describing role, company, and duration if available.
- "education" entries should be short strings describing degree, institution, and year if available.
- Output must be valid JSON parseable by JSON.parse with no trailing commas and no comments.`;
}

/**
 * Step 10: Candidate Evaluation Prompt.
 * Receives the structured resume JSON + job description and produces
 * a compatibility assessment. Final decision/status/recommendation are
 * still recalculated deterministically in code (see candidateEvaluationService.js)
 * so the model's opinion never overrides the fixed decision rules.
 */
function buildCandidateEvaluationPrompt(resumeJson, jobDescription) {
  return `You are a candidate evaluation engine. Compare the candidate's structured resume data against the job description below and produce an objective compatibility assessment.

RESUME DATA (JSON):
${JSON.stringify(resumeJson)}

JOB DESCRIPTION:
${jobDescription}

Return ONLY valid JSON with exactly this shape, no markdown, no code fences, no extra text:

{
  "score": 0,
  "matchedSkills": [],
  "missingSkills": [],
  "strengths": [],
  "weaknesses": [],
  "summary": "",
  "recommendation": "",
  "decision": true,
  "status": "Approved",
  "reasons": ["", "", ""]
}

Rules:
- "score" is an integer from 0 to 100 representing overall compatibility.
- "matchedSkills" are skills from the resume that align with the job description.
- "missingSkills" are skills required by the job description but not found in the resume.
- "summary" is 2-4 sentences, factual and neutral.
- "reasons" must contain EXACTLY 3 short, specific sentences justifying the score/decision (a mix of the strongest matches and the most important gaps).
- Provide your best estimate for "decision", "status", and "recommendation" based on the score, but the backend will recalculate and finalize these deterministically.
- Output must be valid JSON parseable by JSON.parse with no trailing commas and no comments.`;
}

module.exports = { buildResumeExtractionPrompt, buildCandidateEvaluationPrompt };