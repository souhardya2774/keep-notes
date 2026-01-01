const express = require('express');
const router = express.Router();
const {
    getProfile,
    updateProfile,
    deleteAccount,
    getDashboardStats
} = require('../controllers/profileControllers');
const protect = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(protect);

// Profile management routes
router.get('/', getProfile);
router.put('/', updateProfile);
router.delete('/', deleteAccount);
router.get('/stats', getDashboardStats);


module.exports = router;