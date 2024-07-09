const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    walletId: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    userID: { type: String, required: true, unique: true }, // assuming userID is a custom unique identifier
    referralID: { type: String }, // not necessarily unique, depends on use case
    coinCount: { type: Number, default: 0 }, // assuming default coin count is 0
    ownReferralID: { type: String, required: true, unique: true } // unique referral ID for each user
});

const User = mongoose.model('Users', userSchema);

module.exports = User;
