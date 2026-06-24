const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all shelves
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM shelves ORDER BY shelf_id');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get shelf by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM shelves WHERE shelf_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Shelf not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create shelf
router.post('/', async (req, res) => {
    const { shelf_code, floor, section, capacity } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO shelves (shelf_code, floor, section, capacity) 
             VALUES ($1, $2, $3, $4) 
             RETURNING *`,
            [shelf_code, floor, section, capacity]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update shelf
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { shelf_code, floor, section, capacity } = req.body;
    try {
        const result = await pool.query(
            `UPDATE shelves 
             SET shelf_code = $1, floor = $2, section = $3, capacity = $4 
             WHERE shelf_id = $5 
             RETURNING *`,
            [shelf_code, floor, section, capacity, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Shelf not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete shelf
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM shelves WHERE shelf_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Shelf not found' });
        }
        res.json({ message: 'Shelf deleted successfully', deleted: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
