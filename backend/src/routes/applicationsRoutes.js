const express = require('express');
const applicationsController = require('../controllers/applicationsController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Candidature publique (pas besoin d'être connecté)
router.post('/', upload.single('cv'), applicationsController.createApplication);

// Routes recruteur
router.get('/', requireAuth, requireRole('manager'), applicationsController.getApplicationsForManager);
router.patch('/:id/statut', requireAuth, requireRole('manager'), applicationsController.updateApplicationStatus);
router.post('/:id/evaluate', requireAuth, requireRole('manager'), applicationsController.evaluateApplication);

module.exports = router;
