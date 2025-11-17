let workouts = [
    { id: 1, name: "Push Ups", type: "Strength", duration: 20, date: "2025-11-16" },
    { id: 2, name: "Squats", type: "Strength", duration: 15, date: "2025-11-15" }
];

// Return all workouts
function getAll() {
    return workouts;
}

// Add a workout
function addWorkout(workout) {
    workout.id = workouts.length ? workouts[workouts.length - 1].id + 1 : 1;
    workouts.push(workout);
}

// Update a workout by ID
function updateWorkout(id, updatedWorkout) {
    const index = workouts.findIndex(w => w.id == id);
    if (index !== -1) {
        updatedWorkout.id = id; // keep same ID
        workouts[index] = updatedWorkout;
    }
}

// Delete by ID
function deleteById(id) {
    workouts = workouts.filter(w => w.id != id);
}

module.exports = { getAll, addWorkout, updateWorkout, deleteById };
