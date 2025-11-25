const express = require("express");
const router = express.Router();

const { saveNewUser, checkEmailExists } = require("../config/db.js");

router.get("/signup", (req, res) => {
    res.render("signup", { error: null });
});

router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.render("signup", { error: "All fields are required." });
    }

    try {
        const emailTaken = await checkEmailExists(email);

        if (emailTaken) {
            return res.render("signup", { error: "Email already in use." });
        }

  
        const newUser = {
            username,
            email,
            password
        };

        await saveNewUser(newUser);

        res.redirect("/login");
    } catch (err) {
        console.error(err);
        res.render("signup", { error: "Something went wrong." });
    }
});

module.exports = router;
