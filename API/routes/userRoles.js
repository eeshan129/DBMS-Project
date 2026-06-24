const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all user roles
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM user_roles');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get user role by composite key
router.get('/:user_id/:role_id', async (req, res) => {
    const { user_id, role_id } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM user_roles WHERE user_id = $1 AND role_id = $2',
            [user_id, role_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User role association not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create user role association
router.post('/', async (req, res) => {
    const { user_id, role_id } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO user_roles (user_id, role_id) 
             VALUES ($1, $2) 
             RETURNING *`,
            [user_id, role_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update user role association
router.put('/:user_id/:role_id', async (req, res) => {
    const { user_id, role_id } = req.params;
    const { assigned_at } = req.body;
    try {
        const result = await pool.query(
            `UPDATE user_roles 
             SET assigned_at = $1 
             WHERE user_id = $2 AND role_id = $3 
             RETURNING *`,
            [assigned_at || new Date().toISOString(), user_id, role_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User role association not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete user role association
router.delete('/:user_id/:role_id', async (req, res) => {
    const { user_id, role_id } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2 RETURNING *',
            [user_id, role_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User role association not found' });
        }
        res.json({ message: 'User role association deleted successfully', deleted: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
