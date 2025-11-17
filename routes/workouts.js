let workouts = [
    { id: 1, name: "Push Ups", reps: 20 },
    { id: 2, name: "Squats", reps: 15 }
];

// Return all workouts
function getAll() {
    return workouts;
}

// Delete by ID
function deleteById(id) {
    workouts = workouts.filter(w => w.id != id);
}

module.exports = { getAll, deleteById };
