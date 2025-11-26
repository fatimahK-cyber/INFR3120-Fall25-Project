const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Type: { type: String, required: true },
  Duration: { type: Number, required: true }, // or String if you used that
  Date: { type: Date, required: true },       // or String if you used that
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Workout", workoutSchema);
