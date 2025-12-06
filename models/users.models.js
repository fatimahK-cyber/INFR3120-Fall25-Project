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
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,   // plain text for this assignment
  },

  profileImage: {
    type: String,
    default: "/uploads/default.png"   // you can create a default picture later
  }
});


module.exports = mongoose.model("User", userSchema);
