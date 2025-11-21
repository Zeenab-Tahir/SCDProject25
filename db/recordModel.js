

const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  id: Number,
  name: String,
  value: String,
  created: String,
});

module.exports = mongoose.model("Record", recordSchema);

