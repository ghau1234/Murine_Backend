const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const File = require('../models/File');
const crypto = require('crypto');

const router = express.Router();

// Utility function to generate unique referral ID
const generateReferralID = () => {
    return crypto.randomBytes(4).toString('hex'); // Generates a random 8-character hex string
};

// Utility function to generate unique user ID
const generateUserID = () => {
    const timestamp = Date.now().toString();
    const randomNum = Math.floor(Math.random() * 10000).toString();
    return timestamp + randomNum;
};


// Register route
router.post('/register', async (req, res) => {
    try {
        const { email, walletId, password, referralID, coinCount } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: 'User already exists' });
        }

        // Check if referralID is provided and exists
        if (referralID) {
            const existingReferral = await User.findOne({ ownReferralID: referralID });
            if (!existingReferral) {
                return res.status(400).send({ message: 'Referral ID is incorrect' });
            }
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate unique ownReferralID
        const ownReferralID = generateReferralID();

        // Generate unique userID
        const userID = generateUserID();

        // Create a new user
        const user = new User({ email, walletId, password: hashedPassword, role: 'user', userID, referralID, coinCount, ownReferralID });
        await user.save();

        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).send(error);
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({ message: 'Email not registered' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ message: 'Incorrect password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id, role: user.role }, 'your_jwt_secret_key', { expiresIn: '1h' });

        //   res.send({ message: 'Login successful', token, role: user.role });
        res.send({ message: 'Login successful', token, user: { userID: user.userID, referralID: user.referralID, ownReferralID: user.ownReferralID, coinCount: user.coinCount, role: user.role } });
    } catch (error) {
        res.status(400).send(error);
    }
});
// router.get('/admin/userslist', async (req, res) => {
//     try {
//         const users = await User.find(); // Fetch all users
//         // Fetch files for each user
//         const usersWithFiles = await Promise.all(users.map(async user => {
//             const files = await File.find({ userId: user.userID });

//             // Map file details to base64 content
//             const filesWithBase64 = files.map(file => ({
//                 filename: file.filename,
//                 contentType: file.contentType,
//                 data: file.data.toString('base64')
//             }));

//             return {
//                 user: user,
//                 files: filesWithBase64
//             };
//         }));
//         res.json(usersWithFiles);
//     } catch (error) {
//         console.error('Failed to fetch users:', error);
//         res.status(500).send('Server Error');
//     }
// });
router.get('/admin/userslist', async (req, res) => {
    try {
        const users = await User.find();
        // console.log('Fetched users:', users);

        const usersWithFiles = await Promise.all(users.map(async user => {
            const files = await File.find({ userId: user.userID });
            // console.log(`Files for user ${user.userID}:`, files);

            const filesWithBase64 = files.map(file => ({
                filename: file.filename,
                contentType: file.contentType,
                data: file.data.toString('base64')
            }));

            return {
                user: user,
                files: filesWithBase64
            };
        }));

        console.log('Users with files:', usersWithFiles);
        res.json(usersWithFiles);
    } catch (error) {
        console.error('Failed to fetch users with files:', error);
        res.status(500).send('Server Error');
    }
});
module.exports = router;
