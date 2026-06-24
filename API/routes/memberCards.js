const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all member cards
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM member_cards ORDER BY card_id');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get member card by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM member_cards WHERE card_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Member card not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create member card
router.post('/', async (req, res) => {
    const { user_id, membership_id, card_number, issued_date, expiry_date, is_active } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO member_cards (user_id, membership_id, card_number, issued_date, expiry_date, is_active) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING *`,
            [
                user_id,
                membership_id,
                card_number,
                issued_date || new Date().toISOString().split('T')[0],
                expiry_date,
                is_active !== undefined ? is_active : true
            ]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update member card
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { user_id, membership_id, card_number, issued_date, expiry_date, is_active } = req.body;
    try {
        const result = await pool.query(
            `UPDATE member_cards 
             SET user_id = $1, membership_id = $2, card_number = $3, issued_date = $4, expiry_date = $5, is_active = $6 
             WHERE card_id = $7 
             RETURNING *`,
            [user_id, membership_id, card_number, issued_date, expiry_date, is_active, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Member card not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete member card
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM member_cards WHERE card_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Member card not found' });
        }
        res.json({ message: 'Member card deleted successfully', deleted: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
