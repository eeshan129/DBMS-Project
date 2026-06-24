const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all reviews
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM reviews ORDER BY review_id');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get review by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM reviews WHERE review_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create review
router.post('/', async (req, res) => {
    const { user_id, book_id, rating, comment } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO reviews (user_id, book_id, rating, comment) 
             VALUES ($1, $2, $3, $4) 
             RETURNING *`,
            [user_id, book_id, rating, comment]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update review
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { user_id, book_id, rating, comment } = req.body;
    try {
        const result = await pool.query(
            `UPDATE reviews 
             SET user_id = $1, book_id = $2, rating = $3, comment = $4 
             WHERE review_id = $5 
             RETURNING *`,
            [user_id, book_id, rating, comment, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete review
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM reviews WHERE review_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.json({ message: 'Review deleted successfully', deleted: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
