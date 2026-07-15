const pool = require('../config/db');

async function attachTags(offers) {
    if (offers.length === 0) return offers;

    const ids = offers.map((offer) => offer.id);
    const [tagRows] = await pool.query(
        `SELECT job_id, tag FROM job_tags WHERE job_id IN (${ids.map(() => '?').join(',')})`,
        ids
    );

    const tagsByJobId = {};
    for (const row of tagRows) {
        if (!tagsByJobId[row.job_id]) tagsByJobId[row.job_id] = [];
        tagsByJobId[row.job_id].push(row.tag);
    }

    return offers.map((offer) => ({ ...offer, tags: tagsByJobId[offer.id] || [] }));
}

// ===============================
// GET ALL OFFERS
// GET /api/offers
// ===============================
exports.getAllOffers = async (req, res) => {
    try {

        const { status } = req.query;
        const [offers] = status
            ? await pool.query('SELECT * FROM jobs WHERE status = ? ORDER BY created_at DESC', [status])
            : await pool.query('SELECT * FROM jobs ORDER BY created_at DESC');
        const offersWithTags = await attachTags(offers);

        res.status(200).json(offersWithTags);

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

        const [withTags] = await attachTags(rows);
        res.status(200).json(withTags);

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

        const { title, company, location, contract, description, status, tags } = req.body;

        const [result] = await pool.query(
            'INSERT INTO jobs (title, company, location, contract, description, manager_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title, company, location, contract, description, req.user.id, status || 'draft']
        );

        if (Array.isArray(tags) && tags.length > 0) {
            await pool.query(
                `INSERT INTO job_tags (job_id, tag) VALUES ${tags.map(() => '(?, ?)').join(', ')}`,
                tags.flatMap((tag) => [result.insertId, tag])
            );
        }

        const [rows] = await pool.query('SELECT * FROM jobs WHERE id = ?', [result.insertId]);
        const [withTags] = await attachTags(rows);

        res.status(201).json({
            message: "Offre créée avec succès.",
            offer: withTags
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

        if (existing[0].manager_id !== req.user.id) {
            return res.status(403).json({ message: "Vous ne pouvez modifier que vos propres offres." });
        }

        const { title, company, location, contract, description, status, tags } = req.body;

        await pool.query(
            'UPDATE jobs SET title = ?, company = ?, location = ?, contract = ?, description = ?, status = ? WHERE id = ?',
            [title, company, location, contract, description, status, id]
        );

        if (Array.isArray(tags)) {
            await pool.query('DELETE FROM job_tags WHERE job_id = ?', [id]);
            if (tags.length > 0) {
                await pool.query(
                    `INSERT INTO job_tags (job_id, tag) VALUES ${tags.map(() => '(?, ?)').join(', ')}`,
                    tags.flatMap((tag) => [id, tag])
                );
            }
        }

        const [rows] = await pool.query('SELECT * FROM jobs WHERE id = ?', [id]);
        const [withTags] = await attachTags(rows);

        res.status(200).json({
            message: "Offre mise à jour.",
            offer: withTags
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

        if (existing[0].manager_id !== req.user.id) {
            return res.status(403).json({ message: "Vous ne pouvez supprimer que vos propres offres." });
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

        res.json(await attachTags(rows));

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Erreur de recherche."
        });

    }

};