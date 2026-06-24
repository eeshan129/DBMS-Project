const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all borrowing records
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM borrowing_records ORDER BY borrow_id');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get borrowing record by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM borrowing_records WHERE borrow_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Borrowing record not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create borrowing record
router.post('/', async (req, res) => {
    const { user_id, copy_id, issued_by, due_date, return_date, status } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO borrowing_records 
             (user_id, copy_id, issued_by, due_date, return_date, status) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING *`,
            [user_id, copy_id, issued_by, due_date, return_date, status || 'Borrowed']
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update borrowing record
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { user_id, copy_id, issued_by, borrow_date, due_date, return_date, status } = req.body;
    try {
        const result = await pool.query(
            `UPDATE borrowing_records 
             SET user_id = $1, copy_id = $2, issued_by = $3, borrow_date = $4, due_date = $5, return_date = $6, status = $7 
             WHERE borrow_id = $8 
             RETURNING *`,
            [user_id, copy_id, issued_by, borrow_date, due_date, return_date, status, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Borrowing record not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete borrowing record
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM borrowing_records WHERE borrow_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Borrowing record not found' });
        }
        res.json({ message: 'Borrowing record deleted successfully', deleted: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
