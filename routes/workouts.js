function requireSignIn(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.redirect("/signin");
    }
    next();
}


let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Workout = require('../models/workouts.models.js');

// CRUD Operations

/* READ - list all workouts for this user */
router.get('/', requireSignIn, async (req, res, next) => {
    try {
        // ONLY get workouts for this user
        const workoutList = await Workout.find({ user: req.session.user._id });
        res.render('MyWorkouts', { title: 'My Workouts', workoutList });
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});

/* GET add form - create operation */
router.get('/add', requireSignIn, async (req, res, next) => {
    try {
        res.render('add', { title: 'Add workout' });
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});

/* POST add form - create operation */
router.post('/add', requireSignIn, async (req, res, next) => {
    try {
        let newWorkout = Workout({
            "Name": req.body.Name,
            "Type": req.body.Type,
            "Duration": req.body.Duration,
            "Date": req.body.Date,
            user: req.session.user._id,
        });

        await Workout.create(newWorkout);

        // CHANGED: go back to list page
        res.redirect('/workouts');
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});

/* GET edit form - update operation */
router.get('/edit/:id', requireSignIn, async (req, res, next) => {
    try {
        const id = req.params.id;
        const WorkoutToEdit = await Workout.findOne({ _id: id, user: req.session.user._id });

        res.render('edit', {
            title: 'Edit Workout',
            book: WorkoutToEdit  // (name "book" is weird but fine if your EJS uses it)
        });
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});

/* POST edit form - update operation */
router.post('/edit/:id', requireSignIn, async (req, res, next) => {
    try {
        let id = req.params.id;
        let updatedWorkout = Workout({
            "_id": id,
            "Name": req.body.Name,
            "Type": req.body.Type,
            "Duration": req.body.Duration,
            "Date": req.body.Date,
            user: req.session.user._id,
        });

        await Workout.findByIdAndUpdate(id, updatedWorkout);

        // CHANGED: go back to /workouts instead of /MyWorkouts
        res.redirect('/workouts');
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});

/* DELETE workout - delete operation */
router.get('/delete/:id', requireSignIn, async (req, res, next) => {
    try {
        let id = req.params.id;
        await Workout.deleteOne({ _id: id, user: req.session.user._id });

        // CHANGED: go back to /workouts instead of /MyWorkouts
        res.redirect('/workouts');
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
