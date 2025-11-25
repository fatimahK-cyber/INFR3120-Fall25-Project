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



//CRUD Operations

/* READ */
router.get('/', requireSignIn, async (req, res, next) => {
    try {
        // ONLY get workouts for this user
        const workoutList = await Workout.find({ user: req.session.user._id });
        res.render('MyWorkouts', { title: 'My Workouts', workoutList });


    }
    catch(err) {
        console.error(err);
        next(err);
        }
    
    })

/* get the data  - create operation*/
router.get('/add', requireSignIn, async (req, res, next) => {
    try
    {
        res.render('add', {title: 'Add workout'});
    }
    catch(err) {
        console.error(err);
        next(err);
        }
    
    })


/* post the data  - create operation*/
router.post('/add', requireSignIn, async (req, res, next) => {
    try
    {
        let newWorkout = Workout({
            "Name": req.body.Name,
            "Type": req.body.Type,
            "Duration": req.body.Duration,
            "Date": req.body.Date,
            user: req.session.user._id,
        });
        Workout.create(newWorkout).then(()=>{
            res.redirect('/add');
        });
    }
    catch(err) {
        console.error(err);
        next(err);
        }
    
    })


/* get the route for update  - update operation*/
router.get('/edit/:id', requireSignIn, async (req, res, next) => {
    try
    {
        const id = req.params.id;
        const WorkoutToEdit = await Workout.findOne({ _id: id, user: req.session.user._id });
        res.render('edit', {
            title: 'Edit Workout',
             book: WorkoutToEdit
            });
    }
    catch(err) {
        console.error(err);
        next(err);
        }
    }
    )


/* post the route for update  - create operation*/
router.post('/edit/:id', requireSignIn, async (req, res, next) => {
    try
    {
        let id = req.params.id;
        let updatedWorkout = Workout({
            "_id": id,
            "Name": req.body.Name,
            "Type": req.body.Type,
            "Duration": req.body.Duration,
            "Date": req.body.Date
        });
        Workout.findByIdAndUpdate(id, updatedWorkout).then(()=>{
            res.redirect('/MyWorkouts');
        });
    }
    catch(err) {
        console.error(err);
        next(err);
        }
    
    })


/* get the route for performing delete  - delete operation*/
router.get('/delete/:id', requireSignIn, async (req, res, next) => {
    try
    {
        let id = req.params.id;
        Workout.deleteOne({ _id: id, user: req.session.user._id }).then(()=>{
            res.redirect('/MyWorkouts');
        })
    }
    catch(err) {
        console.error(err);
        next(err);
        }
    
    })






module.exports = router;