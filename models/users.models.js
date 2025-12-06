const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  email: {
    type: String,
    required: false,    // optional for OAuth users
    unique: true,
    lowercase: true,
    trim: true,
    sparse: true,       // allows multiple users with null email
  },

  password: {
    type: String,
    required: false,    // optional for OAuth users
  },

  githubId: {
    type: String,
    required: false,    // store GitHub ID if login via GitHub
  },

  displayName: {
    type: String,
    required: false,
  }
});

module.exports = mongoose.model("User", userSchema);
