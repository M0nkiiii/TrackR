const UsageData = require('../models/UsageData');
const { Sequelize } = require('sequelize');
const asyncHandler = require('express-async-handler');
const User = require('../models/User'); // Adjust based on your project structure

// Track screen usage
const trackScreenUsage = async (req, res) => {
    try {
        const { appName, duration } = req.body;
        const userId = req.user.id;

        const usageRecord = await UsageData.create({
            userId,
            appName,
            duration,
        });

        res.status(201).json({ message: 'Usage tracked successfully', usageRecord });
    } catch (error) {
        console.error('Error tracking usage:', error.message);
        res.status(500).json({ error: 'Failed to track usage' });
    }
};

// Fetch dashboard data
const getUserDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;

        const totalScreenTime = await UsageData.sum('duration', { where: { userId } });

        const appUsage = await UsageData.findAll({
            where: { userId },
            attributes: [
                'appName',
                [Sequelize.fn('SUM', Sequelize.col('duration')), 'totalTime'],
            ],
            group: ['appName'],
            order: [[Sequelize.literal('totalTime'), 'DESC']],
        });

        res.status(200).json({ totalScreenTime, appUsage });
    } catch (error) {
        console.error('Error fetching dashboard data:', error.message);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
};

// Controller to get usage data
const getUsageData = asyncHandler(async (req, res) => {
    const usageData = await Usage.find(); // Replace with your specific query
    if (!usageData) {
      res.status(404);
      throw new Error('Usage data not found');
    }
    res.status(200).json(usageData);
  });
  
  // Controller to update usage data
  const updateUsageData = asyncHandler(async (req, res) => {
    const { id, updatedField } = req.body;
  
    const usageData = await Usage.findById(id);
    if (!usageData) {
      res.status(404);
      throw new Error('Usage data not found');
    }
  
    usageData.updatedField = updatedField || usageData.updatedField;
  
    const updatedData = await usageData.save();
    res.status(200).json(updatedData);
  });

module.exports = { trackScreenUsage, getUserDashboardData, getUsageData,
 updateUsageData, };
