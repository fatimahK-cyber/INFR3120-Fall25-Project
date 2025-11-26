// page for sign out 
const express = require("express");
const router = express.Router();

router.get("/signout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/signin");
    });
});

module.exports = router;
