const mongoose = require('mongoose');
const db = require('./mongoConnection.js');
mongoose.Promise = global.Promise;

const pledgeSchema = new mongoose.Schema({
  name: String,
  pledge: Number,
  pledgeTime: Number,
});

const Pledge = mongoose.model('Pledge', pledgeSchema);

module.exports = Pledge;
