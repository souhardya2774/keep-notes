const express= require("express");
const router= express.Router();
const passport= require("passport");

const Limiter= require("../middleware/loginLimiter");
const authController= require("../controllers/authControllers");

router.route("/google")
    .get(Limiter,passport.authenticate('google', { scope: ['profile'] }));

router.route("/google/callback")
    .get(passport.authenticate("google",{
        successRedirect: "https://keep-notes-client.vercel.app",
        failureRedirect: "/login/failed"
    }));

router.route("/login/failed")
    .post(authController.loginFailed);

router.route("/check")
    .get(authController.checkLogin);

router.route("/logout")
    .get(authController.logout);

module.exports= router;