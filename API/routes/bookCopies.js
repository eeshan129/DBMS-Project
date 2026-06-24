const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all book copies
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM book_copies ORDER BY copy_id');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get book copy by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM book_copies WHERE copy_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Book copy not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create book copy
router.post('/', async (req, res) => {
    const { book_id, shelf_id, copy_number, condition, is_available, acquired_date } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO book_copies 
             (book_id, shelf_id, copy_number, condition, is_available, acquired_date) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING *`,
            [
                book_id,
                shelf_id,
                copy_number,
                condition || 'Good',
                is_available !== undefined ? is_available : true,
                acquired_date || new Date().toISOString().split('T')[0]
            ]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update book copy
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { book_id, shelf_id, copy_number, condition, is_available, acquired_date } = req.body;
    try {
        const result = await pool.query(
            `UPDATE book_copies 
             SET book_id = $1, shelf_id = $2, copy_number = $3, condition = $4, is_available = $5, acquired_date = $6 
             WHERE copy_id = $7 
             RETURNING *`,
            [book_id, shelf_id, copy_number, condition, is_available, acquired_date, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Book copy not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete book copy
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM book_copies WHERE copy_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Book copy not found' });
        }
        res.json({ message: 'Book copy deleted successfully', deleted: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
