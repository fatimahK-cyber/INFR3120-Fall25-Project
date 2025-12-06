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

/**
 * NOTE:
 * This router is mounted at /profile in app.js:
 *   app.use("/profile", profileRoutes);
 *
 * So the paths below are:
 *   GET  /profile          -> show profile page
 *   POST /profile/upload   -> upload new picture
 *   POST /profile/delete   -> reset to default picture
 */

// ========================
// SHOW PROFILE PAGE  (GET /profile)
// ========================
router.get("/", requireSignIn, (req, res) => {
  res.render("profile", { session: req.session });
});

// ========================
// UPLOAD PROFILE IMAGE  (POST /profile/upload)
// ========================
router.post(
  "/upload",
  requireSignIn,
  upload.single("profileImage"),
  async (req, res) => {
    if (!req.file) return res.redirect("/profile");

    const imagePath = "/uploads/" + req.file.filename;

    await User.findByIdAndUpdate(req.session.user._id, {
      profileImage: imagePath,
    });

    // keep session in sync so navbar + pages update immediately
    req.session.user.profileImage = imagePath;

    res.redirect("/profile");
  }
);

// ========================
// DELETE PROFILE IMAGE  (POST /profile/delete)
// ========================
router.post("/delete", requireSignIn, async (req, res) => {
  const defaultImage = "/uploads/default.png";

  await User.findByIdAndUpdate(req.session.user._id, {
    profileImage: defaultImage,
  });

  req.session.user.profileImage = defaultImage;

  res.redirect("/profile");
});

module.exports = router;
