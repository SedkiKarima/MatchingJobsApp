const path = require('path');
const pool = require('../config/db');
const processResume = require('../services/_process-resume');

exports.createApplication = async (req, res) => {
  try {
    const { job_id, nom, prenom, email, telephone, whatsapp, linkedin, portfolio, message } = req.body;

    if (!job_id || !nom || !prenom || !email || !telephone) {
      return res.status(400).json({ error: 'job_id, nom, prenom, email et telephone sont requis' });
    }

    const [jobs] = await pool.query('SELECT id FROM jobs WHERE id = ?', [job_id]);
    if (jobs.length === 0) {
      return res.status(404).json({ error: 'Offre introuvable' });
    }

    const resumePath = req.file ? `/uploads/${req.file.filename}` : null;
    const candidateId = req.user ? req.user.id : null;

    const [result] = await pool.query(
      `INSERT INTO applications
        (job_id, candidate_id, nom, prenom, email, telephone, whatsapp, linkedin, portfolio, message, resume_path)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [job_id, candidateId, nom, prenom, email, telephone, whatsapp === 'true' || whatsapp === true, linkedin || null, portfolio || null, message || null, resumePath]
    );

    res.status(201).json({ message: 'Candidature envoyée', applicationId: result.insertId });
  } catch (error) {
    console.error('Erreur createApplication:', error);
    res.status(500).json({ error: "Impossible d'envoyer la candidature" });
  }
};

exports.getApplicationsForManager = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.*, j.title AS job_title, j.company AS job_company
       FROM applications a
       JOIN jobs j ON j.id = a.job_id
       ORDER BY a.applied_at DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error('Erreur getApplicationsForManager:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des candidatures' });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    if (!['Pas encore traité', 'Accepté', 'Refusé'].includes(statut)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }

    const [rows] = await pool.query('SELECT id FROM applications WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Candidature introuvable' });
    }

    await pool.query('UPDATE applications SET statut = ? WHERE id = ?', [statut, id]);
    res.json({ message: 'Statut mis à jour' });
  } catch (error) {
    console.error('Erreur updateApplicationStatus:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
  }
};

exports.evaluateApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT a.id, a.resume_path, j.description
       FROM applications a
       JOIN jobs j ON j.id = a.job_id
       WHERE a.id = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Candidature introuvable' });
    }

    const application = rows[0];
    if (!application.resume_path) {
      return res.status(400).json({ error: 'Cette candidature ne contient pas de CV.' });
    }
    if (!application.resume_path.toLowerCase().endsWith('.pdf')) {
      return res.status(400).json({ error: "L'analyse IA ne supporte que les CV au format PDF." });
    }
    if (!application.description) {
      return res.status(400).json({ error: "L'offre associée n'a pas de description à comparer." });
    }

    const pdfPath = path.join(__dirname, '../../uploads', path.basename(application.resume_path));
    const { evaluation } = await processResume(pdfPath, application.description);

    await pool.query(
      `UPDATE applications
       SET ai_score = ?, ai_decision = ?, ai_reasons = ?, ai_summary = ?, ai_evaluated_at = NOW()
       WHERE id = ?`,
      [evaluation.score, evaluation.decision, JSON.stringify(evaluation.reasons), evaluation.summary, id]
    );

    res.json({
      score: evaluation.score,
      accepted: evaluation.decision,
      reasons: evaluation.reasons,
      status: evaluation.status,
      summary: evaluation.summary,
    });
  } catch (error) {
    console.error('Erreur evaluateApplication:', error);
    res.status(500).json({ error: "Erreur lors de l'analyse IA de la candidature" });
  }
};
