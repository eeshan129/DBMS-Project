const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all publishers
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM publishers ORDER BY publisher_id');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get publisher by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM publishers WHERE publisher_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Publisher not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create publisher
router.post('/', async (req, res) => {
    const { name, country, website, contact_email } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO publishers (name, country, website, contact_email) 
             VALUES ($1, $2, $3, $4) 
             RETURNING *`,
            [name, country, website, contact_email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update publisher
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, country, website, contact_email } = req.body;
    try {
        const result = await pool.query(
            `UPDATE publishers 
             SET name = $1, country = $2, website = $3, contact_email = $4 
             WHERE publisher_id = $5 
             RETURNING *`,
            [name, country, website, contact_email, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Publisher not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete publisher
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM publishers WHERE publisher_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Publisher not found' });
        }
        res.json({ message: 'Publisher deleted successfully', deleted: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
