const mongoose = require('mongoose');
const db = require('./mongoConnection.js');
mongoose.Promise = global.Promise;

const campaignSchema = new mongoose.Schema({
  campaign: String,
  description: String,
  author: String,
  currency: String,
  pledged: Number,
  goal: Number,
  backers: Number,
  endDate: Number,
  location: Number,
  _type: Number,
});

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;
