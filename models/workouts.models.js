
// Import mongoose
let mongoose = require('mongoose');

// Define the structure for a book entry
let WorkoutModel = mongoose.Schema({
    "Name": String,
    "Type": String,
    "Duration": Number,
    "Date": Date

},
{
    collection: "workouts"
});

// Make the model available to use in other files
module.exports = mongoose.model('Workout', WorkoutModel);