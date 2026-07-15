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
router.post("/", authMiddleware.requireAuth, offersController.createOffer);

// Modifier une offre
router.put("/:id", authMiddleware.requireAuth, offersController.updateOffer);

// Supprimer une offre
router.delete("/:id", authMiddleware.requireAuth, offersController.deleteOffer);

module.exports = router;