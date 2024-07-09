const express = require('express');
const multer = require('multer');
const File = require('../models/File');

const router = express.Router();

// Configure Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// File upload route (without authentication)
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const userIds = req.body.userId; // Access userId from req.body
        const file = new File({
            filename: req.file.originalname,
            contentType: req.file.mimetype,
            data: req.file.buffer,
            // Optionally, you can add a userId if required
            userId: userIds
        });
        await file.save();
        res.status(201).json({ message: 'File uploaded successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Failed to upload file', error: error.message });
    }
});

module.exports = router;
