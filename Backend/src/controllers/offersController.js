const pool = require('../config/db');


// ===============================
// GET ALL OFFERS
// GET /api/offers
// ===============================
exports.getAllOffers = async (req, res) => {
    try {

        const [offers] = await pool.query('SELECT * FROM jobs');

        res.status(200).json(offers);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Erreur lors de la récupération des offres."
        });

    }
};


// ===============================
// GET OFFER BY ID
// GET /api/offers/:id
// ===============================
exports.getOfferById = async (req, res) => {

    try {
        const id = req.params.id;

        const [rows] = await pool.query('SELECT * FROM jobs WHERE id = ?', [id]);

        if (!rows || rows.length === 0) {

            return res.status(404).json({
                message: "Offre introuvable."
            });

        }

        res.status(200).json(rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Erreur serveur."
        });

    }

};


// ===============================
// CREATE OFFER
// POST /api/offers
// ===============================
exports.createOffer = async (req, res) => {

    try {

        const { title, company, location, contract, description, manager_id, status } = req.body;

        const [result] = await pool.query(
            'INSERT INTO jobs (title, company, location, contract, description, manager_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title, company, location, contract, description, manager_id || null, status || 'draft']
        );

        const [rows] = await pool.query('SELECT * FROM jobs WHERE id = ?', [result.insertId]);

        res.status(201).json({
            message: "Offre créée avec succès.",
            offer: rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Impossible de créer l'offre."
        });

    }

};


// ===============================
// UPDATE OFFER
// PUT /api/offers/:id
// ===============================
exports.updateOffer = async (req, res) => {

    try {

        const id = req.params.id;

        const [existing] = await pool.query('SELECT * FROM jobs WHERE id = ?', [id]);

        if (!existing || existing.length === 0) {

            return res.status(404).json({
                message: "Offre introuvable."
            });

        }

        const { title, company, location, contract, description, manager_id, status } = req.body;

        await pool.query(
            'UPDATE jobs SET title = ?, company = ?, location = ?, contract = ?, description = ?, manager_id = ?, status = ? WHERE id = ?',
            [title, company, location, contract, description, manager_id || null, status, id]
        );

        const [rows] = await pool.query('SELECT * FROM jobs WHERE id = ?', [id]);

        res.status(200).json({
            message: "Offre mise à jour.",
            offer: rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Erreur lors de la mise à jour."
        });

    }

};


// ===============================
// DELETE OFFER
// DELETE /api/offers/:id
// ===============================
exports.deleteOffer = async (req, res) => {

    try {

        const id = req.params.id;

        const [existing] = await pool.query('SELECT * FROM jobs WHERE id = ?', [id]);

        if (!existing || existing.length === 0) {

            return res.status(404).json({
                message: "Offre introuvable."
            });

        }

        await pool.query('DELETE FROM jobs WHERE id = ?', [id]);

        res.status(200).json({
            message: "Offre supprimée."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Erreur lors de la suppression."
        });

    }

};


// ===============================
// SEARCH OFFERS
// GET /api/offers/search?q=react
// ===============================
exports.searchOffers = async (req, res) => {

    try {

        const keyword = `%${req.query.q || ""}%`;

        const [rows] = await pool.query(
            'SELECT * FROM jobs WHERE title LIKE ? OR location LIKE ? OR company LIKE ?',
            [keyword, keyword, keyword]
        );

        res.json(rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Erreur de recherche."
        });

    }

};