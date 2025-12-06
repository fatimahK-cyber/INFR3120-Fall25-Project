const express = require("express");
const router = express.Router();
const User = require("../models/users.models");

// Middleware – make sure user is logged in
function requireSignIn(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.redirect("/signin");
    }
    next();
}

// GET: show change password form
router.get("/password/change", requireSignIn, (req, res) => {
    res.render("changePassword", {
        session: req.session,
        error: null,
        success: null
    });
});

// POST: handle form submit
router.post("/password/change", requireSignIn, async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // 1. basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
        return res.render("changePassword", {
            session: req.session,
            error: "Please fill in all fields.",
            success: null
        });
    }

    if (newPassword !== confirmPassword) {
        return res.render("changePassword", {
            session: req.session,
            error: "New password and confirm password do not match.",
            success: null
        });
    }

    try {
        // 2. find the logged-in user
        const userId = req.session.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.render("changePassword", {
                session: req.session,
                error: "User not found.",
                success: null
            });
        }

        // 3. check current password
        // If you use plain text passwords:
        if (user.password !== currentPassword) {
            return res.render("changePassword", {
                session: req.session,
                error: "Current password is incorrect.",
                success: null
            });
        }

        

        // 4. update password
        user.password = newPassword;

        
        await user.save();

        // update password in session
        req.session.user.password = user.password;

        return res.render("changePassword", {
            session: req.session,
            error: null,
            success: "Password updated successfully!"
        });
    } catch (err) {
        console.error(err);
        return res.render("changePassword", {
            session: req.session,
            error: "Something went wrong. Please try again.",
            success: null
        });
    }
});

module.exports = router;
