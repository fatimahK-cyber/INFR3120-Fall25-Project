const express = require("express");
const router = express.Router();

const { getAll, deleteById } = require("./workouts");

// GET /workouts  → My Workouts page
router.get("/", (req, res) => {
    const workouts = getAll();
    res.render("MyWorkouts", { workouts });
});

// GET /workouts/add → Add Workout page
router.get("/add", (req, res) => {
    res.render("add", { workout: null }); 
});


// POST /workouts/:id/delete → Delete workout
router.post("/:id/delete", (req, res) => {
    deleteById(req.params.id);
    res.redirect("/workouts");
});

module.exports = router;
