// Post method for sign in
router.post('/signin', function(req, res, next) {
    // handle sign in form submission here
});

// Get method for sign in
router.get('/signin', function(req, res, next) {
    res.render('signin', { message: '' });
});
