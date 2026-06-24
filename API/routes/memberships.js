const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all memberships
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM memberships ORDER BY membership_id');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get membership by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM memberships WHERE membership_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Membership not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create membership
router.post('/', async (req, res) => {
    const { plan_name, max_books, duration_days, price, description } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO memberships (plan_name, max_books, duration_days, price, description) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING *`,
            [
                plan_name,
                max_books !== undefined ? max_books : 3,
                duration_days !== undefined ? duration_days : 30,
                price,
                description
            ]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update membership
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { plan_name, max_books, duration_days, price, description } = req.body;
    try {
        const result = await pool.query(
            `UPDATE memberships 
             SET plan_name = $1, max_books = $2, duration_days = $3, price = $4, description = $5 
             WHERE membership_id = $6 
             RETURNING *`,
            [plan_name, max_books, duration_days, price, description, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Membership not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete membership
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM memberships WHERE membership_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Membership not found' });
        }
        res.json({ message: 'Membership deleted successfully', deleted: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
