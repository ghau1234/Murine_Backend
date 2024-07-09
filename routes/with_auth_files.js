const express = require('express');
const multer = require('multer');
const File = require('../models/File');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// File upload route
router.post('/upload', auth, upload.single('file'), async (req, res) => {
    try {
        const file = new File({
            filename: req.file.originalname,
            contentType: req.file.mimetype,
            data: req.file.buffer,
            userId: req.user.userId // Assuming userId is stored in the token payload
        });
        await file.save();
        res.status(201).json({ message: 'File uploaded successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Failed to upload file', error: error.message });
    }
});

module.exports = router;
