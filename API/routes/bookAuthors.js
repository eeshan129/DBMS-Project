const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all book authors
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM book_authors');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get book author by composite key
router.get('/:book_id/:author_id', async (req, res) => {
    const { book_id, author_id } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM book_authors WHERE book_id = $1 AND author_id = $2',
            [book_id, author_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Book author association not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create book author association
router.post('/', async (req, res) => {
    const { book_id, author_id, role } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO book_authors (book_id, author_id, role) 
             VALUES ($1, $2, $3) 
             RETURNING *`,
            [book_id, author_id, role || 'Author']
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update book author association
router.put('/:book_id/:author_id', async (req, res) => {
    const { book_id, author_id } = req.params;
    const { role } = req.body;
    try {
        const result = await pool.query(
            `UPDATE book_authors 
             SET role = $1 
             WHERE book_id = $2 AND author_id = $3 
             RETURNING *`,
            [role, book_id, author_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Book author association not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete book author association
router.delete('/:book_id/:author_id', async (req, res) => {
    const { book_id, author_id } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM book_authors WHERE book_id = $1 AND author_id = $2 RETURNING *',
            [book_id, author_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Book author association not found' });
        }
        res.json({ message: 'Book author association deleted successfully', deleted: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
