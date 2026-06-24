const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all fines
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM fines ORDER BY fine_id');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get fine by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM fines WHERE fine_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Fine not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create fine
router.post('/', async (req, res) => {
    const { user_id, amount, reason, issued_date, paid_date, is_paid } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO fines (user_id, amount, reason, issued_date, paid_date, is_paid) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING *`,
            [
                user_id,
                amount,
                reason,
                issued_date || new Date().toISOString(),
                paid_date,
                is_paid !== undefined ? is_paid : false
            ]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update fine
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { user_id, amount, reason, issued_date, paid_date, is_paid } = req.body;
    try {
        const result = await pool.query(
            `UPDATE fines 
             SET user_id = $1, amount = $2, reason = $3, issued_date = $4, paid_date = $5, is_paid = $6 
             WHERE fine_id = $7 
             RETURNING *`,
            [user_id, amount, reason, issued_date, paid_date, is_paid, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Fine not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete fine
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM fines WHERE fine_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Fine not found' });
        }
        res.json({ message: 'Fine deleted successfully', deleted: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
