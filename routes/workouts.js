// making sure it asks for sign in 
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



/* read - list all workouts for this user */
router.get('/', requireSignIn, async (req, res, next) => {
    try {
        // only get workouts for this user
        const workoutList = await Workout.find({ user: req.session.user._id });
        res.render("MyWorkouts", {
            title: "My Workouts",
            workouts: workoutList,
            session: req.session
        });

    }
    catch (err) {
        console.error(err);
        next(err);
    }
});

// GET the add form  
router.get('/add', requireSignIn, async (req, res, next) => {
    try {
        res.render("add", { title: "Add Workout", session: req.session });
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});

//post the data 
router.post('/add', requireSignIn, async (req, res, next) => {
    try {
        let newWorkout = Workout({
            "Name": req.body.Name,
            "Type": req.body.Type,
            "Duration": req.body.Duration,
            "Date": req.body.Date,
            user: req.session.user._id,
        });

        Workout.create(newWorkout).then(()=>{
            res.redirect('/workouts');   //  <<< THIS IS THE WRONG ONE
        });
    }
    catch(err) {
        console.error(err);
        next(err);
    }
})


// GET edit form 
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

// POST edit form
router.post('/edit/:id', requireSignIn, async (req, res, next) => {
  try {
    const id = req.params.id;

    await Workout.findByIdAndUpdate(
      id,
      {
        Name: req.body.Name,
        Type: req.body.Type,
        Duration: req.body.Duration,
        Date: req.body.Date,
        user: req.session.user._id,
      }
    );

    res.redirect('/workouts');
  } catch (err) {
    console.error(err);
    next(err);
  }
});


// DELETE workout 
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
