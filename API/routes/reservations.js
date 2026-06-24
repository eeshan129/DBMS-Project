const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all reservations
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM reservations ORDER BY reservation_id');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get reservation by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM reservations WHERE reservation_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create reservation
router.post('/', async (req, res) => {
    const { user_id, book_id, reserved_at, expires_at, status } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO reservations (user_id, book_id, reserved_at, expires_at, status) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING *`,
            [
                user_id,
                book_id,
                reserved_at || new Date().toISOString(),
                expires_at,
                status || 'Pending'
            ]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update reservation
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { user_id, book_id, reserved_at, expires_at, status } = req.body;
    try {
        const result = await pool.query(
            `UPDATE reservations 
             SET user_id = $1, book_id = $2, reserved_at = $3, expires_at = $4, status = $5 
             WHERE reservation_id = $6 
             RETURNING *`,
            [user_id, book_id, reserved_at, expires_at, status, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete reservation
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM reservations WHERE reservation_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        res.json({ message: 'Reservation deleted successfully', deleted: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
