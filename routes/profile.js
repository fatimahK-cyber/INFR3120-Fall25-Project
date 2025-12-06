const express = require("express");
const router = express.Router();

const User = require("../models/users.models");
const upload = require("../middleware/upload");

// Middleware – require login
function requireSignIn(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect("/signin");
  }
  next();
}

// ========================
// SHOW PROFILE PAGE
// ========================
router.get("/profile", requireSignIn, (req, res) => {
  res.render("profile");
});

// ========================
// UPLOAD PROFILE IMAGE
// ========================
router.post(
  "/profile/upload",
  requireSignIn,
  upload.single("profileImage"),
  async (req, res) => {
    if (!req.file) return res.redirect("/profile");

    const imagePath = "/uploads/" + req.file.filename;

    await User.findByIdAndUpdate(req.session.user._id, {
      profileImage: imagePath
    });

    req.session.user.profileImage = imagePath;

    res.redirect("/profile");
  }
);

// ========================
// DELETE PROFILE IMAGE  ⬅️ PUT THE CODE HERE
// ========================
router.post("/profile/delete", requireSignIn, async (req, res) => {
  const defaultImage = "/uploads/default.png";

  await User.findByIdAndUpdate(req.session.user._id, {
    profileImage: defaultImage
  });

  req.session.user.profileImage = defaultImage;

  res.redirect("/profile");
});

// ========================
module.exports = router;
