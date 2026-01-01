const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Note = require('../models/Note');
const Label = require('../models/Label');

// @desc    Get current user profile
// @route   GET /api/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.status(200).json({
        success: true,
        data: {
            id: user._id,
            name: user.displayName,
            createdAt: user.createdAt
        }
    });
});

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
    const { name } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Update user fields
    if (name) user.displayName = name;

    await user.save();

    res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
            id: user._id,
            name: user.name,
            createdAt: user.createdAt
        }
    });
});

// @desc    Delete user account
// @route   DELETE /api/profile/profile
// @access  Private
const deleteAccount = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Delete all user's notes and labels
    await Note.deleteMany({ userId: req.user.id });
    await Label.deleteMany({ userId: req.user.id });

    // Delete the user account
    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({
        success: true,
        message: 'Account deleted successfully'
    });
});

// @desc    Get dashboard statistics
// @route   GET /api/profile/stats
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    // Get counts
    const notesCount = await Note.countDocuments({ userId: userId });
    const labelsCount = await Label.countDocuments({ userId: userId });
    
    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentNotesCount = await Note.countDocuments({ 
        userId: userId, 
        createdAt: { $gte: sevenDaysAgo } 
    });

    // Get notes by status
    const pinnedNotesCount = await Note.countDocuments({ 
        userId: userId, 
        status: 'pinned'
    });

    const archivedNotesCount = await Note.countDocuments({ 
        userId: userId, 
        status: 'archived'
    });

    // Get label distribution
    const labels = await Label.find({ userId: userId });
    const labelStats = labels.map(label => ({
        id: label._id,
        name: label.name,
        notesCount: label.notes?.length || 0
    }));

    res.status(200).json({
        success: true,
        data: {
            overview: {
                totalNotes: notesCount,
                totalLabels: labelsCount,
                pinnedNotes: pinnedNotesCount,
                archivedNotes: archivedNotesCount,
                recentActivity: recentNotesCount
            },
            labelStats,
            activity: {
                notesCreated: recentNotesCount,
                period: 'last_7_days'
            }
        }
    });
});

module.exports = {
    getProfile,
    updateProfile,
    deleteAccount,
    getDashboardStats
};