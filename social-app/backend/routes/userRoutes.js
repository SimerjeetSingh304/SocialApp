const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, req.user.id + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// @route   GET api/users
// @desc    Get all users (except current user)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const me = await User.findById(req.user.id);
    const myConnections = me.connections || [];

    const users = await User.find({ _id: { $ne: req.user.id } }).select('name email _id createdAt avatarUrl').lean();
    
    const usersWithConnectionStatus = users.map(u => ({
      ...u,
      isConnected: myConnections.some(id => id.toString() === u._id.toString())
    }));
    
    res.json(usersWithConnectionStatus);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/users/avatar
// @desc    Upload user avatar
// @access  Private
router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }
    const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    const user = await User.findById(req.user.id);
    user.avatarUrl = avatarUrl;
    await user.save();

    res.json({ avatarUrl, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findById(req.user.id);
    if (name) user.name = name;
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/users/connect/:id
// @desc    Toggle connection with another user
// @access  Private
router.post('/connect/:id', auth, async (req, res) => {
  try {
    const me = await User.findById(req.user.id);
    const targetUserId = req.params.id;

    if (me.connections.includes(targetUserId)) {
      // Disconnect
      me.connections = me.connections.filter(id => id.toString() !== targetUserId);
    } else {
      // Connect
      me.connections.push(targetUserId);
    }

    await me.save();
    res.json({ connections: me.connections });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
