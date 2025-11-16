// Simple in-memory workout list for now

let workouts = [
    { id: 1, name: "Leg Day", type: "Strength", duration: 60, date: "2025-01-01" },
    { id: 2, name: "Cardio Blast", type: "Cardio", duration: 30, date: "2025-01-05" }
];

function getAll() {
    return workouts;
}

function deleteById(id) {
    workouts = workouts.filter(w => w.id !== Number(id));
}

module.exports = {
    getAll,
    deleteById
};
