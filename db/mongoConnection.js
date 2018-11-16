const mongoose = require('mongoose');
const mongoUri = 'mongodb://localhost/sdc';

const db = mongoose.connect(mongoUri);

module.exports = db;
