const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  followers: [],
  following: []
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);