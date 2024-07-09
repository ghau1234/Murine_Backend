const express = require('express');
const router = express.Router();
const Settings = require('../models/Setting');

// GET /admin/settings - Retrieve settings
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch settings', error: error.message });
  }
});

// POST /admin/settings - Update settings
router.post('/', async (req, res) => {
  try {
    const { timer, murinePrice, murineHead, storageUsed, storageTotal } = req.body;
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings({ timer, murinePrice, murineHead, storageUsed, storageTotal });
    } else {
      settings.timer = timer;
      settings.murinePrice = murinePrice;
      settings.murineHead = murineHead;
      settings.storageUsed = storageUsed;
      settings.storageTotal = storageTotal;
    }

    await settings.save();
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update settings', error: error.message });
  }
});

module.exports = router;
