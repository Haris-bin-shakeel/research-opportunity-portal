const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/opportunities - Create a new research opportunity
router.post('/', async (req, res) => {
    try {
        const { title, description, research_area, faculty_name, department, required_skills, positions, deadline, status } = req.body;

        // validating required fields
        if (!title || !description || !research_area || !faculty_name || !department || !required_skills || !positions || !deadline) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required. Please fill in every field.'
            });
        }

        // checking if positions is a valid number
        if (isNaN(positions) || positions < 1) {
            return res.status(400).json({
                success: false,
                message: 'Number of positions must be a positive number.'
            });
        }

        const opportunityStatus = status || 'Open';

        const query = `INSERT INTO opportunities (title, description, research_area, faculty_name, department, required_skills, positions, deadline, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const [result] = await db.execute(query, [title, description, research_area, faculty_name, department, required_skills, positions, deadline, opportunityStatus]);

        // fetching the newly created record to send it back
        const [newOpportunity] = await db.execute('SELECT * FROM opportunities WHERE id = ?', [result.insertId]);

        res.status(201).json({
            success: true,
            message: 'Research opportunity created successfully!',
            data: newOpportunity[0]
        });
    } catch (error) {
        console.error('Error creating opportunity:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error. Something went wrong on the server.'
        });
    }
});

// GET /api/opportunities - Get all research opportunities
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM opportunities ORDER BY created_at DESC');

        res.status(200).json({
            success: true,
            message: 'All opportunities fetched successfully.',
            data: rows
        });
    } catch (error) {
        console.error('Error fetching opportunities:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching opportunities.'
        });
    }
});

// GET /api/opportunities/:id - Get one research opportunity by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.execute('SELECT * FROM opportunities WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Opportunity with ID ${id} not found.`
            });
        }

        res.status(200).json({
            success: true,
            message: 'Opportunity fetched successfully.',
            data: rows[0]
        });
    } catch (error) {
        console.error('Error fetching opportunity:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching the opportunity.'
        });
    }
});

// PUT /api/opportunities/:id - Update an existing research opportunity
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, research_area, faculty_name, department, required_skills, positions, deadline, status } = req.body;

        // first check if the opportunity even exists
        const [existing] = await db.execute('SELECT * FROM opportunities WHERE id = ?', [id]);

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Opportunity with ID ${id} not found. Cannot update.`
            });
        }

        // validate required fields
        if (!title || !description || !research_area || !faculty_name || !department || !required_skills || !positions || !deadline) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required for updating.'
            });
        }

        if (isNaN(positions) || positions < 1) {
            return res.status(400).json({
                success: false,
                message: 'Positions must be a positive number.'
            });
        }

        const opportunityStatus = status || 'Open';

        const query = `UPDATE opportunities SET title = ?, description = ?, research_area = ?, faculty_name = ?, department = ?, required_skills = ?, positions = ?, deadline = ?, status = ? WHERE id = ?`;

        await db.execute(query, [title, description, research_area, faculty_name, department, required_skills, positions, deadline, opportunityStatus, id]);

        // getting the updated record
        const [updated] = await db.execute('SELECT * FROM opportunities WHERE id = ?', [id]);

        res.status(200).json({
            success: true,
            message: 'Opportunity updated successfully!',
            data: updated[0]
        });
    } catch (error) {
        console.error('Error updating opportunity:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while updating.'
        });
    }
});

// DELETE /api/opportunities/:id - Delete a research opportunity
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // check if it exists first
        const [existing] = await db.execute('SELECT * FROM opportunities WHERE id = ?', [id]);

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Opportunity with ID ${id} not found. Nothing to delete.`
            });
        }

        await db.execute('DELETE FROM opportunities WHERE id = ?', [id]);

        res.status(200).json({
            success: true,
            message: 'Opportunity deleted successfully!'
        });
    } catch (error) {
        console.error('Error deleting opportunity:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while deleting.'
        });
    }
});

module.exports = router;
