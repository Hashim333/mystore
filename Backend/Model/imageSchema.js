// db.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  filename: String,
});

const Image = mongoose.model('Prdimg', imageSchema);

module.exports = Image;
