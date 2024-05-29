const express = require('express');
const User = require('../models/User');
const { authenticateUser, authorizeAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/profile', authenticateUser, async (req, res) => {
  try {
    const { bio, phone, photo, isPublic } = req.body;
    const updatedProfile = { bio, phone, photo, isPublic };
    const user = await User.findByIdAndUpdate(req.user.id, updatedProfile, { new: true }).select('-password');
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/admin/profiles', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const profiles = await User.find().select('-password');
    res.status(200).json(profiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
