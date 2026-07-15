const express = require("express");
const router = express.Router();

const offersController = require("../controllers/offersController");
const authMiddleware = require("../middleware/authMiddleware");

// ============================
// PUBLIC ROUTES
// ============================

// Recherche (doit être avant "/:id")
router.get("/search", offersController.searchOffers);

// Liste des offres
router.get("/", offersController.getAllOffers);

// Détail d'une offre
router.get("/:id", offersController.getOfferById);

// ============================
// MANAGER ROUTES
// ============================

// Créer une offre
router.post("/", authMiddleware.requireAuth, authMiddleware.requireRole('manager'), offersController.createOffer);

// Modifier une offre
router.put("/:id", authMiddleware.requireAuth, authMiddleware.requireRole('manager'), offersController.updateOffer);

// Supprimer une offre
router.delete("/:id", authMiddleware.requireAuth, authMiddleware.requireRole('manager'), offersController.deleteOffer);

module.exports = router;