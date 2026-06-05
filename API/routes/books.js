const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all books
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM books ORDER BY book_id'
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

});

// Get book by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM books WHERE book_id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

});

// Create book
router.post('/', async (req, res) => {
    const { title, isbn, publication_year, publisher_id } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO books
             (title, isbn, publication_year, publisher_id)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [title, isbn, publication_year, publisher_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update book
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, isbn, publication_year, publisher_id } = req.body;
    try {
        const result = await pool.query(
            `UPDATE books
             SET title = $1,
                 isbn = $2,
                 publication_year = $3,
                 publisher_id = $4
             WHERE book_id = $5
             RETURNING *`,
            [title, isbn, publication_year, publisher_id, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

});

// Delete book
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM books WHERE book_id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }

        res.json({
            message: 'Book deleted successfully',
            deleted: result.rows[0]
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;