const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all notifications
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM notifications ORDER BY notification_id');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get notification by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM notifications WHERE notification_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create notification
router.post('/', async (req, res) => {
    const { user_id, title, message, type, is_read } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO notifications (user_id, title, message, type, is_read) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING *`,
            [
                user_id,
                title,
                message,
                type || 'Info',
                is_read !== undefined ? is_read : false
            ]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update notification
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { user_id, title, message, type, is_read } = req.body;
    try {
        const result = await pool.query(
            `UPDATE notifications 
             SET user_id = $1, title = $2, message = $3, type = $4, is_read = $5 
             WHERE notification_id = $6 
             RETURNING *`,
            [user_id, title, message, type, is_read, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete notification
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM notifications WHERE notification_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        res.json({ message: 'Notification deleted successfully', deleted: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
