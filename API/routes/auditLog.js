const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all audit logs
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM audit_log ORDER BY log_id DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get audit log by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM audit_log WHERE log_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Audit log not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create audit log
router.post('/', async (req, res) => {
    const { table_name, operation, record_id, changed_by, old_data, new_data } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO audit_log 
             (table_name, operation, record_id, changed_by, old_data, new_data) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING *`,
            [table_name, operation, record_id, changed_by, old_data, new_data]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update audit log
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { table_name, operation, record_id, changed_by, old_data, new_data } = req.body;
    try {
        const result = await pool.query(
            `UPDATE audit_log 
             SET table_name = $1, operation = $2, record_id = $3, changed_by = $4, old_data = $5, new_data = $6 
             WHERE log_id = $7 
             RETURNING *`,
            [table_name, operation, record_id, changed_by, old_data, new_data, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Audit log not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete audit log
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM audit_log WHERE log_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Audit log not found' });
        }
        res.json({ message: 'Audit log deleted successfully', deleted: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
