const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const Goal = require('../models/Goal'); // Ensure this model exists

// Add a new goal
router.post('/add', authenticateToken, async (req, res) => {
    try {
        const { goalName, description, targetTime } = req.body;

        if (!goalName || !targetTime) {
            return res.status(400).json({ error: 'Goal name and target time are required.' });
        }

        const userId = req.user.id; // Extract the user ID from the token
        const newGoal = await Goal.create({
            userId,
            goalName,
            description,
            targetTime: new Date(targetTime),
        });

        res.status(201).json({ message: 'Goal added successfully', goal: newGoal });
    } catch (error) {
        console.error('Error adding goal:', error.message);
        res.status(500).json({ error: 'Failed to add goal' });
    }
});

// Fetch all goals for the authenticated user
router.get('/user-goals', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from the token
        const goals = await Goal.findAll({ where: { userId } });

        res.status(200).json(goals);
    } catch (error) {
        console.error('Error fetching goals:', error.message);
        res.status(500).json({ error: 'Failed to fetch goals' });
    }
});


module.exports = router;
