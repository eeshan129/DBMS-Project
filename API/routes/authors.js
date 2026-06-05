const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all authors
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM authors ORDER BY author_id'
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get author by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM authors WHERE author_id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Author not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create author
router.post('/', async (req, res) => {
    const { full_name, nationality, birth_date, bio } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO authors
             (full_name, nationality, birth_date, bio)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [full_name, nationality, birth_date, bio]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update author
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { full_name, nationality, birth_date, bio } = req.body;
    try {
        const result = await pool.query(
            `UPDATE authors
             SET full_name = $1,
                 nationality = $2,
                 birth_date = $3,
                 bio = $4
             WHERE author_id = $5
             RETURNING *`,
            [full_name, nationality, birth_date, bio, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Author not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete author
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM authors WHERE author_id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Author not found' });
        }

        res.json({
            message: 'Author deleted successfully',
            deleted: result.rows[0]
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;