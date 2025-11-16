const express = require("express");
const router = express.Router();

const { getAll, deleteById } = require("../data/workouts");

// GET /workouts  → My Workouts page
router.get("/", (req, res) => {
    const workouts = getAll();
    res.render("workouts/index", { workouts });
});

// POST /workouts/:id/delete  → Delete workout
router.post("/:id/delete", (req, res) => {
    deleteById(req.params.id);
    res.redirect("/workouts");
});

module.exports = router;
