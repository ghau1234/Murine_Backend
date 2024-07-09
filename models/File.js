const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    data: { type: Buffer, required: true },
    userId: { type: String, required: true }

});

const File = mongoose.model('File', fileSchema);

module.exports = File;
