const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  timer: {
    type: Date,
    required: true
  },
  murinePrice: {
    type: Number,
    required: true
  },
  murineHead: {
    type: String,
    required: true
  },
  storageUsed: {
    type: Number,
    required: true
  },
  storageTotal: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Setting', SettingsSchema);
