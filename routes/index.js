const express = require("express");
const router = express.Router();
const { getAll, addWorkout, updateWorkout, deleteById } = require("./workouts");

// GET /workouts → My Workouts
router.get("/", (req, res) => {
    const workouts = getAll();
    res.render("MyWorkouts", { workouts, page: 'list' });
});

// GET /workouts/add → Add Workout page
router.get("/add", (req, res) => {
    res.render("add", { workout: null, page: 'add' });
});

// GET /workouts/:id/edit → Edit Workout page
router.get("/:id/edit", (req, res) => {
    const workout = getAll().find(w => w.id == req.params.id);
    if (!workout) return res.redirect("/workouts");
    res.render("add", { workout, page: 'add' });
});

// POST /workouts → Add or Update workout
router.post("/", (req, res) => {
    const { id, name, type, duration, date } = req.body;

    if (id) {
        // Update existing workout
        updateWorkout(parseInt(id), { name, type, duration, date });
    } else {
        // Add new workout
        addWorkout({ name, type, duration, date });
    }

    res.redirect("/workouts");
});

// POST /workouts/:id/delete → Delete
router.post("/:id/delete", (req, res) => {
    deleteById(req.params.id);
    res.redirect("/workouts");
});

module.exports = router;
